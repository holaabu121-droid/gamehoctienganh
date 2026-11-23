from __future__ import annotations

import json
import re
from dataclasses import asdict, dataclass
from functools import lru_cache
from pathlib import Path

CATALOG_PATH = Path(__file__).resolve().parents[2] / "data" / "curriculum" / "catalog.json"
COURSE_ID_RE = re.compile(r"^[a-z0-9][a-z0-9-]{0,63}$")
BRANCH_ID_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$")
COURSE_STATUSES = {"available", "planned"}


@dataclass(frozen=True)
class Course:
    id: str
    subject: str
    subject_label: str
    grade: int
    semester: int
    title: str
    description: str
    status: str
    content_version: str | None
    branch_ids: tuple[str, ...]

    def to_dict(self) -> dict[str, object]:
        payload = asdict(self)
        payload["branch_ids"] = list(self.branch_ids)
        return payload


@dataclass(frozen=True)
class CourseCatalog:
    schema_version: int
    default_course_id: str
    courses: tuple[Course, ...]

    def course(self, course_id: str) -> Course | None:
        return next((course for course in self.courses if course.id == course_id), None)

    def to_dict(self) -> dict[str, object]:
        return {
            "schema_version": self.schema_version,
            "default_course_id": self.default_course_id,
            "courses": [course.to_dict() for course in self.courses],
        }


def _required_string(item: dict[str, object], field: str) -> str:
    value = item.get(field)
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"course catalog field {field!r} must be a non-empty string")
    return value


def _parse_course(item: object) -> Course:
    if not isinstance(item, dict):
        raise ValueError("course catalog entries must be objects")
    course_id = _required_string(item, "id")
    status = _required_string(item, "status")
    grade = item.get("grade")
    semester = item.get("semester")
    branch_ids = item.get("branch_ids")
    content_version = item.get("content_version")
    if not COURSE_ID_RE.fullmatch(course_id):
        raise ValueError(f"invalid course id: {course_id}")
    if status not in COURSE_STATUSES:
        raise ValueError(f"invalid course status: {status}")
    if isinstance(grade, bool) or not isinstance(grade, int) or grade < 1:
        raise ValueError(f"invalid grade for course {course_id}")
    if semester not in (1, 2):
        raise ValueError(f"invalid semester for course {course_id}")
    if not isinstance(branch_ids, list) or any(not isinstance(value, str) or not BRANCH_ID_RE.fullmatch(value) for value in branch_ids):
        raise ValueError(f"invalid branch_ids for course {course_id}")
    if len(branch_ids) != len(set(branch_ids)):
        raise ValueError(f"duplicate branch id in course {course_id}")
    if status == "available" and not branch_ids:
        raise ValueError(f"available course {course_id} must have branches")
    if content_version is not None and not isinstance(content_version, str):
        raise ValueError(f"invalid content_version for course {course_id}")
    return Course(
        id=course_id,
        subject=_required_string(item, "subject"),
        subject_label=_required_string(item, "subject_label"),
        grade=grade,
        semester=semester,
        title=_required_string(item, "title"),
        description=_required_string(item, "description"),
        status=status,
        content_version=content_version,
        branch_ids=tuple(branch_ids),
    )


def load_course_catalog(path: Path = CATALOG_PATH) -> CourseCatalog:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, dict) or payload.get("schema_version") != 1:
        raise ValueError("unsupported course catalog schema")
    raw_courses = payload.get("courses")
    if not isinstance(raw_courses, list) or not raw_courses:
        raise ValueError("course catalog must contain courses")
    courses = tuple(_parse_course(item) for item in raw_courses)
    course_ids = [course.id for course in courses]
    if len(course_ids) != len(set(course_ids)):
        raise ValueError("course ids must be unique")
    branch_ids = [branch_id for course in courses for branch_id in course.branch_ids]
    if len(branch_ids) != len(set(branch_ids)):
        raise ValueError("branch ids must be globally unique across courses")
    default_course_id = payload.get("default_course_id")
    if not isinstance(default_course_id, str) or default_course_id not in course_ids:
        raise ValueError("default_course_id must reference a course")
    if next(course for course in courses if course.id == default_course_id).status != "available":
        raise ValueError("default course must be available")
    return CourseCatalog(schema_version=1, default_course_id=default_course_id, courses=courses)


@lru_cache(maxsize=1)
def course_catalog() -> CourseCatalog:
    return load_course_catalog()


DEFAULT_COURSE_ID = course_catalog().default_course_id


def require_course(course_id: str) -> Course:
    course = course_catalog().course(course_id)
    if course is None:
        raise KeyError(course_id)
    return course


def course_for_branch(branch_id: str) -> Course | None:
    return next((course for course in course_catalog().courses if branch_id in course.branch_ids), None)


def require_branch(branch_id: str) -> Course:
    course = course_for_branch(branch_id)
    if course is None:
        raise KeyError(branch_id)
    return course


def registered_branch_ids() -> frozenset[str]:
    return frozenset(branch_id for course in course_catalog().courses for branch_id in course.branch_ids)
