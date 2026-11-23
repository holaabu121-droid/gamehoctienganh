import type { CourseCatalog } from "../curriculum/courseCatalog";

export type AuthUser = {
  id?: string | number;
  username: string;
  created_at?: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

export type UnitSummary = {
  unit_id: string;
  completion_percent: number;
  current_streak: number;
  best_streak: number;
  earned_score?: number;
  max_score?: number;
  core_complete?: boolean;
  improvement_targets?: ImprovementTarget[];
  progress?: ActivityProgress[];
  required_practice?: RequiredPracticeState;
};

export type ImprovementTarget = { activity_id: string; earned_score: number; max_score: number; percent: number; completed: boolean; weak_questions: Array<{ question_index: number; earned_score: number }> };
export type QuestionProgress = { question_index: number; earned_score: number; status: "scored" | "skipped" };
export type ActivityProgress = { unit_id: string; activity_id: string; earned_score: number; max_score: number; completed: boolean; updated_at: string; question_scores?: QuestionProgress[] };
export type RequiredPracticeItem = { activity_id: string; minimum_seconds: number; confirmed: boolean; elapsed_seconds?: number; confirmed_at?: string };
export type RequiredPracticeState = { complete: boolean; items: RequiredPracticeItem[] };
export type BonusStageState = { stage_id: "treasure" | "boss" | "detective"; claimed: boolean; game_score?: number; reward_base?: number; reward_awarded?: number; tier?: "high" | "standard" };
export type BonusState = { unit_id: string; gate: "locked_incomplete" | "locked_practice" | "locked_score" | "ready"; core_complete: boolean; completion_percent: number; available_tier: "high" | "standard" | null; tier_locked: "high" | "standard" | null; high_tier_locked_out: boolean; reward_total: number; next_stage: BonusStageState["stage_id"] | null; stages: BonusStageState[]; improvement_targets: ImprovementTarget[]; required_practice: RequiredPracticeState };
export type BonusClaimResult = { claim: { stage_id: BonusStageState["stage_id"]; tier: "high" | "standard"; reward_base: number; reward_awarded: number; halved: boolean; roll: number }; state: BonusState };
export type ScoreBranch = { unit_id: string; earned_score: number; max_score: number; percent: number; completed_activities: number; total_activities: number; last_updated: string | null };
export type BestScoreHistoryItem = { id: number; unit_id: string; activity_id: string; previous_best: number; new_best: number; improvement: number; max_score: number; recorded_at: string };
export type ScoreProfile = {
  user: AuthUser;
  course_id: string;
  course_best: { earned_score: number; max_score: number; percent: number; completed_activities: number; total_activities: number };
  branches: ScoreBranch[];
  bonus_reward_total: number;
  best_history: BestScoreHistoryItem[];
  current_streak: number;
  best_streak: number;
  recommendations: Array<{ unit_id: string; activity_id: string; skipped_questions: QuestionProgress[]; weak_questions: QuestionProgress[] }>;
};
export type ScoreTotal = { earned_score: number; max_score: number; percent: number; completed_activities: number; total_activities: number; bonus_reward_total: number };
export type ScoreOverviewSubject = ScoreTotal & { subject: string; subject_label: string; course_count: number };
export type ScoreOverviewCourse = ScoreTotal & { course_id: string; subject: string; subject_label: string; grade: number; semester: number; title: string; status: "available" | "planned"; last_updated: string | null };
export type ScoreOverview = { user: AuthUser; grand_total: ScoreTotal; subjects: ScoreOverviewSubject[]; courses: ScoreOverviewCourse[] };
export type BackupRestoreResult = {
  restored: boolean;
  source_username: string;
  snapshot_created: boolean;
  counts: { activities: number; questions: number; study_days: number; practice: number; bonus_rewards: number; history: number };
};
export type BackupDownload = { blob: Blob; filename: string };

export type ActivityProgressUpdate = {
  earned_score: number;
  max_score: number;
  completed: boolean;
  question_scores?: number[];
  question_statuses?: Array<"scored" | "skipped">;
};

export type QuestionCheckpointUpdate = {
  earned_score: number;
  status: "scored" | "skipped";
};

type Credentials = { username: string; password: string };

const DEFAULT_API_BASE_URL = import.meta.env.DEV || window.location.port === "4173"
  ? "http://127.0.0.1:8000"
  : window.location.origin;
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  const payload = response.status === 204 ? undefined : await response.json().catch(() => undefined);
  if (!response.ok) {
    const message = typeof payload?.detail === "string" ? payload.detail : "Không thể kết nối với máy chủ. Vui lòng thử lại.";
    throw new ApiError(message, response.status);
  }
  return payload as T;
}

export const authApi = {
  getCourseCatalog() {
    return request<CourseCatalog>("/courses");
  },
  register(credentials: Credentials) {
    return request<unknown>("/auth/register", { method: "POST", body: JSON.stringify(credentials) });
  },
  login(credentials: Credentials) {
    return request<AuthSession>("/auth/login", { method: "POST", body: JSON.stringify(credentials) });
  },
  me(token: string) {
    return request<AuthUser>("/auth/me", {}, token);
  },
  logout(token: string) {
    return request<void>("/auth/logout", { method: "POST" }, token);
  },
  getUnitSummary(token: string, unitId: string) {
    return request<UnitSummary>(`/units/${encodeURIComponent(unitId)}/summary`, {}, token);
  },
  getScoreProfile(token: string, courseId?: string) {
    const path = courseId ? `/courses/${encodeURIComponent(courseId)}/profile` : "/profile/scores";
    return request<ScoreProfile>(path, {}, token);
  },
  getScoreOverview(token: string) {
    return request<ScoreOverview>("/profile/overview", {}, token);
  },
  async downloadBackup(token: string): Promise<BackupDownload> {
    const response = await fetch(`${API_BASE_URL}/profile/backup`, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) {
      const payload = await response.json().catch(() => undefined);
      throw new ApiError(typeof payload?.detail === "string" ? payload.detail : "Không thể tạo bản sao lưu.", response.status);
    }
    const disposition = response.headers.get("Content-Disposition") || "";
    const filename = disposition.match(/filename="?([^";]+)"?/i)?.[1] || "english-quest-student-backup.json";
    return { blob: await response.blob(), filename };
  },
  restoreBackup(token: string, backup: unknown) {
    return request<BackupRestoreResult>("/profile/backup/restore", { method: "POST", body: JSON.stringify({ backup }) }, token);
  },
  saveProgress(token: string, unitId: string, activityId: string, update: ActivityProgressUpdate) {
    return request<unknown>(`/progress/${encodeURIComponent(unitId)}/${encodeURIComponent(activityId)}`, { method: "PUT", body: JSON.stringify(update) }, token);
  },
  saveQuestionProgress(token: string, unitId: string, activityId: string, questionIndex: number, update: QuestionCheckpointUpdate) {
    return request<ActivityProgress>(`/progress/${encodeURIComponent(unitId)}/${encodeURIComponent(activityId)}/questions/${questionIndex}`, { method: "PUT", body: JSON.stringify(update) }, token);
  },
  completeActivity(token: string, unitId: string, activityId: string) {
    return request<ActivityProgress>(`/progress/${encodeURIComponent(unitId)}/${encodeURIComponent(activityId)}/complete`, { method: "POST" }, token);
  },
  confirmPractice(token: string, unitId: string, activityId: string, elapsedSeconds: number) {
    return request<RequiredPracticeState>(`/practice/${encodeURIComponent(unitId)}/${encodeURIComponent(activityId)}/confirm`, { method: "POST", body: JSON.stringify({ elapsed_seconds: elapsedSeconds }) }, token);
  },
  getBonusState(token: string, unitId: string) {
    return request<BonusState>(`/bonus/${encodeURIComponent(unitId)}`, {}, token);
  },
  selectStandardBonus(token: string, unitId: string) {
    return request<BonusState>(`/bonus/${encodeURIComponent(unitId)}/select-standard`, { method: "POST" }, token);
  },
  claimBonus(token: string, unitId: string, stageId: string, score: { earned_score: number; max_score: number }) {
    return request<BonusClaimResult>(`/bonus/${encodeURIComponent(unitId)}/${encodeURIComponent(stageId)}/claim`, { method: "POST", body: JSON.stringify(score) }, token);
  },
};
