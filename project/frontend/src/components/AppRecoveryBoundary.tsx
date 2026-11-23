import { Component, type ErrorInfo, type ReactNode } from "react";

const CHUNK_RELOAD_KEY = "english-quest:chunk-reload-at";
const CHUNK_RELOAD_WINDOW_MS = 60_000;

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function isChunkLoadError(error: unknown): boolean {
  const message = errorMessage(error).toLowerCase();
  return (
    message.includes("failed to fetch dynamically imported module") ||
    message.includes("error loading dynamically imported module") ||
    message.includes("importing a module script failed") ||
    message.includes("chunkloaderror")
  );
}

export function recoverFromStaleChunk(): boolean {
  const now = Date.now();
  const lastReload = Number(window.sessionStorage.getItem(CHUNK_RELOAD_KEY) ?? "0");

  if (Number.isFinite(lastReload) && now - lastReload < CHUNK_RELOAD_WINDOW_MS) {
    return false;
  }

  window.sessionStorage.setItem(CHUNK_RELOAD_KEY, String(now));
  window.location.reload();
  return true;
}

type AppRecoveryBoundaryProps = {
  children: ReactNode;
};

type AppRecoveryBoundaryState = {
  error: unknown | null;
};

export class AppRecoveryBoundary extends Component<AppRecoveryBoundaryProps, AppRecoveryBoundaryState> {
  state: AppRecoveryBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): AppRecoveryBoundaryState {
    return { error };
  }

  componentDidCatch(error: unknown, info: ErrorInfo): void {
    console.error("English Quest could not render the current screen.", error, info);
    if (isChunkLoadError(error)) recoverFromStaleChunk();
  }

  private retry = (): void => {
    window.sessionStorage.removeItem(CHUNK_RELOAD_KEY);
    window.location.reload();
  };

  render(): ReactNode {
    if (!this.state.error) return this.props.children;

    const staleChunk = isChunkLoadError(this.state.error);
    return (
      <main className="app-recovery" role="alert" aria-live="assertive">
        <section className="lesson-card app-recovery__card">
          <span className="app-recovery__icon" aria-hidden="true">{staleChunk ? "🔄" : "🧭"}</span>
          <h1>{staleChunk ? "Nội dung vừa được cập nhật" : "Chưa thể mở nội dung này"}</h1>
          <p>
            {staleChunk
              ? "Ứng dụng cần tải lại phiên bản mới nhất. Điểm số và tiến độ đã lưu không bị thay đổi."
              : "Ứng dụng đã giữ nguyên điểm số và tiến độ. Hãy tải lại để tiếp tục học."}
          </p>
          <button type="button" className="primary-button" onClick={this.retry}>Tải lại ứng dụng</button>
        </section>
      </main>
    );
  }
}
