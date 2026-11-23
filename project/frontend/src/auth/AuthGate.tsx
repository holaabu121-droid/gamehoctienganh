import { useState, type FormEvent } from "react";
import { useAuth } from "./AuthProvider";

type Mode = "login" | "register";

export function AuthGate() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanUsername = username.trim();
    if (!/^[A-Za-z0-9_-]{6,64}$/.test(cleanUsername)) { setError("Tên đăng nhập cần 6–64 chữ không dấu, số, _ hoặc -."); return; }
    if (!/^\d{4,6}$/.test(password)) { setError("Mã PIN phải gồm từ 4 đến 6 chữ số."); return; }
    setBusy(true);
    setError("");
    try {
      await (mode === "login" ? login : register)({ username: cleanUsername, password });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  }

  function changeMode(nextMode: Mode) {
    setMode(nextMode);
    setError("");
  }

  return <main className="app-shell auth-shell">
    <section className="auth-card" aria-labelledby="auth-title">
      <div className="auth-brand"><span aria-hidden="true">🧭</span><div><span className="eyebrow">Luyện tập đa môn · Lớp 6</span><h1 id="auth-title">{mode === "login" ? "Chào mừng em trở lại!" : "Tạo tài khoản học tập"}</h1><p>Đăng nhập để lưu điểm, chuỗi học và tiến độ theo từng môn và học kỳ trên máy này.</p></div></div>
      <div className="auth-tabs" role="tablist" aria-label="Chọn đăng nhập hoặc đăng ký">
        <button type="button" role="tab" aria-selected={mode === "login"} onClick={() => changeMode("login")}>Đăng nhập</button>
        <button type="button" role="tab" aria-selected={mode === "register"} onClick={() => changeMode("register")}>Đăng ký</button>
      </div>
      <form className="auth-form" onSubmit={(event) => void submit(event)}>
        <label>Tên đăng nhập<input autoFocus autoComplete="username" pattern="[A-Za-z0-9_-]{6,64}" minLength={6} maxLength={64} value={username} onChange={(event) => setUsername(event.target.value)} disabled={busy} /></label>
        <label>Mã PIN<input type="password" inputMode="numeric" pattern="[0-9]{4,6}" minLength={4} maxLength={6} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} disabled={busy} /></label>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="primary-button auth-submit" type="submit" disabled={busy}>{busy ? "Đang kết nối…" : mode === "login" ? "Vào học" : "Tạo tài khoản và vào học"}</button>
      </form>
      <p className="auth-privacy">🔒 Tài khoản dùng cho ứng dụng gia đình trên máy cục bộ.</p>
    </section>
  </main>;
}
