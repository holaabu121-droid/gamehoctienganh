import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ApiError, authApi, type AuthUser, type BackupDownload, type BackupRestoreResult, type BonusClaimResult, type BonusState, type ScoreOverview, type ScoreProfile, type UnitSummary } from "./authApi";

const TOKEN_KEY = "english-quest.auth-token";

type AuthStatus = "loading" | "anonymous" | "authenticated";
type Credentials = { username: string; password: string };

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  summary: UnitSummary | null;
  summaryError: string;
  login: (credentials: Credentials) => Promise<void>;
  register: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshSummary: (unitId: string) => Promise<void>;
  getUnitSummary: (unitId: string) => Promise<UnitSummary>;
  getScoreProfile: (courseId?: string) => Promise<ScoreProfile>;
  getScoreOverview: () => Promise<ScoreOverview>;
  downloadBackup: () => Promise<BackupDownload>;
  restoreBackup: (backup: unknown) => Promise<BackupRestoreResult>;
  saveActivityProgress: (unitId: string, activityId: string, earnedScore: number, maxScore: number, completed: boolean, questionScores?: number[], questionStatuses?: Array<"scored" | "skipped">) => Promise<void>;
  saveQuestionProgress: (unitId: string, activityId: string, questionIndex: number, earnedScore: number, status: "scored" | "skipped") => Promise<void>;
  completeActivity: (unitId: string, activityId: string) => Promise<void>;
  confirmPractice: (unitId: string, activityId: string, elapsedSeconds: number) => Promise<void>;
  getBonusState: (unitId: string) => Promise<BonusState>;
  selectStandardBonus: (unitId: string) => Promise<BonusState>;
  claimBonus: (unitId: string, stageId: string, earnedScore: number, maxScore: number) => Promise<BonusClaimResult>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredToken() {
  try { return window.localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

function storeToken(token: string | null) {
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // The session remains usable in memory when storage is unavailable.
  }
}

function readableError(error: unknown) {
  if (error instanceof ApiError) return error.message;
  return "Không kết nối được với máy chủ cục bộ. Hãy kiểm tra ứng dụng đã được khởi động.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [summary, setSummary] = useState<UnitSummary | null>(null);
  const [summaryError, setSummaryError] = useState("");

  const clearSession = useCallback(() => {
    storeToken(null);
    setToken(null);
    setUser(null);
    setSummary(null);
    setSummaryError("");
    setStatus("anonymous");
  }, []);

  const loadSummary = useCallback(async (sessionToken: string, unitId: string) => {
    try {
      const nextSummary = await authApi.getUnitSummary(sessionToken, unitId);
      setSummary(nextSummary);
      setSummaryError("");
    } catch (error) {
      setSummary(null);
      setSummaryError(readableError(error));
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function restore() {
      if (!token) { setStatus("anonymous"); return; }
      try {
        const nextUser = await authApi.me(token);
        if (!active) return;
        setUser(nextUser);
        setStatus("authenticated");
      } catch {
        if (active) clearSession();
      }
    }
    void restore();
    return () => { active = false; };
  }, [clearSession, loadSummary, token]);

  const establishSession = useCallback(async (credentials: Credentials) => {
    const session = await authApi.login(credentials);
    storeToken(session.token);
    setToken(session.token);
    setUser(session.user);
    setStatus("authenticated");
  }, [loadSummary]);

  const login = useCallback((credentials: Credentials) => establishSession(credentials), [establishSession]);
  const register = useCallback(async (credentials: Credentials) => {
    await authApi.register(credentials);
    await establishSession(credentials);
  }, [establishSession]);

  const logout = useCallback(async () => {
    const sessionToken = token;
    clearSession();
    if (sessionToken) await authApi.logout(sessionToken).catch(() => undefined);
  }, [clearSession, token]);

  const refreshSummary = useCallback(async (unitId: string) => {
    if (token) await loadSummary(token, unitId);
  }, [loadSummary, token]);

  const getUnitSummary = useCallback(async (unitId: string) => {
    if (!token) throw new Error("Phiên đăng nhập đã hết hạn.");
    return authApi.getUnitSummary(token, unitId);
  }, [token]);

  const getScoreProfile = useCallback(async (courseId?: string) => {
    if (!token) throw new Error("Phiên đăng nhập đã hết hạn.");
    return authApi.getScoreProfile(token, courseId);
  }, [token]);

  const getScoreOverview = useCallback(async () => {
    if (!token) throw new Error("Phiên đăng nhập đã hết hạn.");
    return authApi.getScoreOverview(token);
  }, [token]);

  const downloadBackup = useCallback(async () => {
    if (!token) throw new Error("Phiên đăng nhập đã hết hạn.");
    return authApi.downloadBackup(token);
  }, [token]);

  const restoreBackup = useCallback(async (backup: unknown) => {
    if (!token) throw new Error("Phiên đăng nhập đã hết hạn.");
    return authApi.restoreBackup(token, backup);
  }, [token]);

  const saveActivityProgress = useCallback(async (unitId: string, activityId: string, earnedScore: number, maxScore: number, completed: boolean, questionScores?: number[], questionStatuses?: Array<"scored" | "skipped">) => {
    if (!token) throw new Error("Phiên đăng nhập đã hết hạn.");
    try {
      await authApi.saveProgress(token, unitId, activityId, { earned_score: earnedScore, max_score: maxScore, completed, question_scores: questionScores, question_statuses: questionStatuses });
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 422 || !questionStatuses) throw error;
      await authApi.saveProgress(token, unitId, activityId, { earned_score: earnedScore, max_score: maxScore, completed, question_scores: questionScores });
    }
    await loadSummary(token, unitId);
  }, [loadSummary, token]);

  const saveQuestionProgress = useCallback(async (unitId: string, activityId: string, questionIndex: number, earnedScore: number, questionStatus: "scored" | "skipped") => {
    if (!token) throw new Error("Phiên đăng nhập đã hết hạn.");
    await authApi.saveQuestionProgress(token, unitId, activityId, questionIndex, { earned_score: earnedScore, status: questionStatus });
    await loadSummary(token, unitId);
  }, [loadSummary, token]);

  const completeActivity = useCallback(async (unitId: string, activityId: string) => {
    if (!token) throw new Error("Phiên đăng nhập đã hết hạn.");
    await authApi.completeActivity(token, unitId, activityId);
    await loadSummary(token, unitId);
  }, [loadSummary, token]);

  const confirmPractice = useCallback(async (unitId: string, activityId: string, elapsedSeconds: number) => {
    if (!token) throw new Error("Phiên đăng nhập đã hết hạn.");
    await authApi.confirmPractice(token, unitId, activityId, elapsedSeconds);
    await loadSummary(token, unitId);
  }, [loadSummary, token]);

  const getBonusState = useCallback(async (unitId: string) => {
    if (!token) throw new Error("Phiên đăng nhập đã hết hạn.");
    return authApi.getBonusState(token, unitId);
  }, [token]);
  const selectStandardBonus = useCallback(async (unitId: string) => {
    if (!token) throw new Error("Phiên đăng nhập đã hết hạn.");
    return authApi.selectStandardBonus(token, unitId);
  }, [token]);
  const claimBonus = useCallback(async (unitId: string, stageId: string, earnedScore: number, maxScore: number) => {
    if (!token) throw new Error("Phiên đăng nhập đã hết hạn.");
    return authApi.claimBonus(token, unitId, stageId, { earned_score: earnedScore, max_score: maxScore });
  }, [token]);

  const value = useMemo<AuthContextValue>(() => ({ status, user, summary, summaryError, login, register, logout, refreshSummary, getUnitSummary, getScoreProfile, getScoreOverview, downloadBackup, restoreBackup, saveActivityProgress, saveQuestionProgress, completeActivity, confirmPractice, getBonusState, selectStandardBonus, claimBonus }), [status, user, summary, summaryError, login, register, logout, refreshSummary, getUnitSummary, getScoreProfile, getScoreOverview, downloadBackup, restoreBackup, saveActivityProgress, saveQuestionProgress, completeActivity, confirmPractice, getBonusState, selectStandardBonus, claimBonus]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
