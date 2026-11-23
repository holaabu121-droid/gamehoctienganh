import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { AppRecoveryBoundary, recoverFromStaleChunk } from "./components/AppRecoveryBoundary";
import "./styles.css";

window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  recoverFromStaleChunk();
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRecoveryBoundary>
      <App />
    </AppRecoveryBoundary>
  </StrictMode>,
);
