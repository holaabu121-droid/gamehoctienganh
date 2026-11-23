from __future__ import annotations

import os
from pathlib import Path
from typing import Annotated

from fastapi import Depends, FastAPI, Header, HTTPException, Path as ApiPath, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, ConfigDict, Field

from .db import DATABASE_SCHEMA_VERSION, InvalidCredentialsError, ProgressRepository, User, UsernameTakenError
from .curriculum import DEFAULT_COURSE_ID, course_catalog, require_course
from .version import APP_VERSION

DEFAULT_DATABASE = Path(__file__).resolve().parents[1] / "data" / "english_quest.db"
ID_PATTERN = r"^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$"
ProgressKey = Annotated[str, ApiPath(min_length=1, max_length=64, pattern=ID_PATTERN)]


class Credentials(BaseModel):
    model_config = ConfigDict(strict=True, extra="forbid")
    username: str = Field(min_length=6, max_length=64, pattern=r"^[A-Za-z0-9_-]+$", strict=True)
    password: str = Field(min_length=4, max_length=6, pattern=r"^[0-9]+$", strict=True)


class ProgressUpdate(BaseModel):
    model_config = ConfigDict(strict=True, extra="forbid")
    earned_score: int = Field(ge=0, strict=True)
    max_score: int = Field(gt=0, strict=True)
    completed: bool = Field(default=False, strict=True)
    question_scores: list[int] | None = None
    question_statuses: list[str] | None = None


class QuestionCheckpointUpdate(BaseModel):
    model_config = ConfigDict(strict=True, extra="forbid")
    earned_score: int = Field(ge=0, le=100, strict=True)
    status: str = Field(pattern=r"^(scored|skipped)$", strict=True)


class BonusClaim(BaseModel):
    model_config = ConfigDict(strict=True, extra="forbid")
    earned_score: int = Field(ge=0, le=1000, strict=True)
    max_score: int = Field(default=1000, ge=1000, le=1000, strict=True)


class PracticeConfirmation(BaseModel):
    model_config = ConfigDict(strict=True, extra="forbid")
    elapsed_seconds: int = Field(ge=60, le=3600, strict=True)


class BackupRestoreRequest(BaseModel):
    model_config = ConfigDict(strict=True, extra="forbid")
    backup: dict[str, object]


def create_app(database_path: str | Path | None = None) -> FastAPI:
    repository = ProgressRepository(Path(database_path or os.environ.get("ENGLISH_QUEST_DB_PATH", DEFAULT_DATABASE)))
    repository.initialize()
    api = FastAPI(title="English Quest API", version=APP_VERSION)
    api.state.repository = repository
    api.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://127.0.0.1:5173", "http://localhost:5173",
            "http://127.0.0.1:4173", "http://localhost:4173",
        ],
        allow_credentials=False,
        allow_methods=["GET", "POST", "PUT", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type"],
    )

    def bearer_token(authorization: str | None = Header(default=None)) -> str:
        if not authorization or not authorization.startswith("Bearer ") or not authorization[7:].strip():
            raise HTTPException(status_code=401, detail="Bearer token required")
        return authorization[7:].strip()

    def current_user(request: Request, token: str = Depends(bearer_token)) -> User:
        user = request.app.state.repository.authenticate(token)
        if user is None: raise HTTPException(status_code=401, detail="Invalid or expired token")
        return user

    @api.get("/health")
    def health(request: Request) -> dict[str, object]:
        database = request.app.state.repository.database_status()
        return {"status": "ok", "version": APP_VERSION, **database}

    @api.get("/courses")
    def courses() -> dict[str, object]:
        return course_catalog().to_dict()

    @api.post("/auth/register", status_code=status.HTTP_201_CREATED)
    def register(credentials: Credentials, request: Request) -> dict[str, object]:
        try: user = request.app.state.repository.register(credentials.username, credentials.password)
        except UsernameTakenError as error: raise HTTPException(status_code=409, detail=str(error)) from error
        return {"user": user.to_dict()}

    @api.post("/auth/login")
    def login(credentials: Credentials, request: Request) -> dict[str, object]:
        try: user, token = request.app.state.repository.login(credentials.username, credentials.password)
        except (InvalidCredentialsError, ValueError) as error: raise HTTPException(status_code=401, detail="Invalid username or password") from error
        return {"token": token, "user": user.to_dict()}

    @api.post("/auth/logout", status_code=status.HTTP_204_NO_CONTENT)
    def logout(request: Request, token: str = Depends(bearer_token)) -> Response:
        request.app.state.repository.logout(token)
        return Response(status_code=204)

    @api.get("/auth/me")
    def me(user: User = Depends(current_user)) -> dict[str, object]:
        return user.to_dict()

    @api.put("/progress/{unit_id}/{activity_id}")
    def write_progress(unit_id: ProgressKey, activity_id: ProgressKey, update: ProgressUpdate,
                       request: Request, user: User = Depends(current_user)) -> dict[str, object]:
        try:
            return request.app.state.repository.save_user_progress(user.id, unit_id, activity_id,
                earned_score=update.earned_score, max_score=update.max_score, completed=update.completed,
                question_scores=update.question_scores, question_statuses=update.question_statuses).to_dict()
        except ValueError as error: raise HTTPException(status_code=422, detail=str(error)) from error

    @api.put("/progress/{unit_id}/{activity_id}/questions/{question_index}")
    def write_question_checkpoint(unit_id: ProgressKey, activity_id: ProgressKey,
                                  question_index: Annotated[int, ApiPath(ge=0, le=99)],
                                  update: QuestionCheckpointUpdate, request: Request,
                                  user: User = Depends(current_user)) -> dict[str, object]:
        try:
            return request.app.state.repository.save_question_progress(
                user.id, unit_id, activity_id, question_index=question_index,
                earned_score=update.earned_score, question_status=update.status,
            ).to_dict()
        except ValueError as error:
            raise HTTPException(status_code=422, detail=str(error)) from error

    @api.post("/progress/{unit_id}/{activity_id}/complete")
    def complete_activity(unit_id: ProgressKey, activity_id: ProgressKey, request: Request,
                          user: User = Depends(current_user)) -> dict[str, object]:
        try:
            return request.app.state.repository.complete_user_activity(user.id, unit_id, activity_id).to_dict()
        except ValueError as error:
            raise HTTPException(status_code=422, detail=str(error)) from error

    @api.get("/units/{unit_id}/summary")
    def unit_summary(unit_id: ProgressKey, request: Request,
                     user: User = Depends(current_user)) -> dict[str, object]:
        try:
            return request.app.state.repository.unit_summary(user.id, unit_id)
        except ValueError as error:
            raise HTTPException(status_code=422, detail=str(error)) from error

    @api.get("/profile/scores")
    def score_profile(request: Request, user: User = Depends(current_user)) -> dict[str, object]:
        return {"user": user.to_dict(), **request.app.state.repository.score_profile(user.id, DEFAULT_COURSE_ID)}

    @api.get("/profile/overview")
    def score_overview(request: Request, user: User = Depends(current_user)) -> dict[str, object]:
        return {"user": user.to_dict(), **request.app.state.repository.score_overview(user.id)}

    @api.get("/profile/backup")
    def export_profile_backup(request: Request, user: User = Depends(current_user)) -> JSONResponse:
        payload = request.app.state.repository.export_user_backup(user.id)
        filename = f"english-quest-{user.username}-backup.json"
        return JSONResponse(
            payload,
            headers={"Content-Disposition": f'attachment; filename="{filename}"', "Cache-Control": "no-store"},
        )

    @api.post("/profile/backup/restore")
    def restore_profile_backup(restore: BackupRestoreRequest, request: Request,
                               user: User = Depends(current_user)) -> dict[str, object]:
        try:
            return request.app.state.repository.restore_user_backup(user.id, restore.backup)
        except (KeyError, ValueError) as error:
            raise HTTPException(status_code=422, detail=str(error)) from error

    @api.get("/courses/{course_id}/profile")
    def course_score_profile(course_id: ProgressKey, request: Request,
                             user: User = Depends(current_user)) -> dict[str, object]:
        try:
            require_course(course_id)
        except KeyError as error:
            raise HTTPException(status_code=404, detail="Unknown course") from error
        return {"user": user.to_dict(), **request.app.state.repository.score_profile(user.id, course_id)}

    @api.get("/bonus/{unit_id}")
    def bonus_state(unit_id: ProgressKey, request: Request, user: User = Depends(current_user)) -> dict[str, object]:
        try:
            return request.app.state.repository.bonus_state(user.id, unit_id)
        except ValueError as error:
            raise HTTPException(status_code=422, detail=str(error)) from error

    @api.post("/practice/{unit_id}/{activity_id}/confirm")
    def confirm_practice(unit_id: ProgressKey, activity_id: ProgressKey, confirmation: PracticeConfirmation,
                         request: Request, user: User = Depends(current_user)) -> dict[str, object]:
        try:
            return request.app.state.repository.confirm_practice(
                user.id, unit_id, activity_id, elapsed_seconds=confirmation.elapsed_seconds
            )
        except ValueError as error: raise HTTPException(status_code=422, detail=str(error)) from error

    @api.post("/bonus/{unit_id}/select-standard")
    def select_standard_bonus(unit_id: ProgressKey, request: Request, user: User = Depends(current_user)) -> dict[str, object]:
        try: return request.app.state.repository.select_standard_bonus(user.id, unit_id)
        except ValueError as error: raise HTTPException(status_code=422, detail=str(error)) from error

    @api.post("/bonus/{unit_id}/{stage_id}/claim")
    def claim_bonus(unit_id: ProgressKey, stage_id: ProgressKey, claim: BonusClaim,
                    request: Request, user: User = Depends(current_user)) -> dict[str, object]:
        try: return request.app.state.repository.claim_bonus(user.id, unit_id, stage_id, earned_score=claim.earned_score, max_score=claim.max_score)
        except ValueError as error: raise HTTPException(status_code=422, detail=str(error)) from error

    frontend_directory = Path(os.environ.get(
        "ENGLISH_QUEST_FRONTEND_DIR",
        Path(__file__).resolve().parents[2] / "frontend" / "dist",
    ))
    frontend_index = frontend_directory / "index.html"
    frontend_assets = frontend_directory / "assets"
    if frontend_index.is_file() and frontend_assets.is_dir():
        api.mount("/assets", StaticFiles(directory=frontend_assets), name="frontend-assets")

        @api.get("/", include_in_schema=False)
        def frontend() -> FileResponse:
            return FileResponse(frontend_index)

    return api


app = create_app()
