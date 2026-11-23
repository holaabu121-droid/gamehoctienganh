from __future__ import annotations

import argparse
import json
import logging
import os
from pathlib import Path
import socket
import sys
import threading
import time
from urllib.error import URLError
from urllib.request import urlopen
import webbrowser


APP_NAME = "English Quest"
DEFAULT_PORT = 8765


def application_root() -> Path:
    frozen_root = getattr(sys, "_MEIPASS", None)
    return Path(frozen_root) if frozen_root else Path(__file__).resolve().parents[1]


def application_version() -> str:
    version_file = application_root() / "VERSION"
    if version_file.is_file():
        return version_file.read_text(encoding="utf-8-sig").strip()
    return "0.0.0-dev"


APP_VERSION = application_version()


def user_data_root(override: str | None = None) -> Path:
    if override:
        return Path(override).expanduser().resolve()
    configured = os.environ.get("ENGLISH_QUEST_DATA_DIR")
    if configured:
        return Path(configured).expanduser().resolve()
    local_app_data = os.environ.get("LOCALAPPDATA")
    base = Path(local_app_data) if local_app_data else Path.home() / "AppData" / "Local"
    return base / "EnglishQuest"


def service_is_compatible(base_url: str) -> bool:
    try:
        with urlopen(f"{base_url}/health", timeout=1.5) as response:
            health = json.load(response)
        with urlopen(f"{base_url}/courses", timeout=1.5) as response:
            catalog = json.load(response)
        return (
            health.get("status") == "ok"
            and health.get("version") == APP_VERSION
            and health.get("schema_version") == health.get("supported_schema_version")
            and health.get("integrity") == "ok"
            and catalog.get("default_course_id") == "english-6-semester-1"
        )
    except (OSError, URLError, ValueError, json.JSONDecodeError):
        return False


def port_is_available(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
        probe.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        return probe.connect_ex(("127.0.0.1", port)) != 0


def show_error(message: str) -> None:
    logging.error(message)
    if sys.platform == "win32":
        try:
            import ctypes
            ctypes.windll.user32.MessageBoxW(0, message, APP_NAME, 0x10)
            return
        except Exception:
            pass
    print(message, file=sys.stderr)


def open_browser_when_ready(base_url: str) -> None:
    for _ in range(80):
        if service_is_compatible(base_url):
            webbrowser.open(base_url)
            return
        time.sleep(0.25)
    show_error(f"{APP_NAME} không khởi động được. Hãy xem nhật ký trong thư mục dữ liệu ứng dụng.")


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the local English Quest desktop service.")
    parser.add_argument("--port", type=int, default=int(os.environ.get("ENGLISH_QUEST_PORT", DEFAULT_PORT)))
    parser.add_argument("--data-dir", default=None)
    parser.add_argument("--no-browser", action="store_true")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    if not 1024 <= args.port <= 65535:
        show_error("Cổng ứng dụng không hợp lệ.")
        return 2

    root = application_root()
    if not getattr(sys, "frozen", False):
        sys.path.insert(0, str(root))
    data_root = user_data_root(args.data_dir)
    database_directory = data_root / "data"
    log_directory = data_root / "logs"
    database_directory.mkdir(parents=True, exist_ok=True)
    log_directory.mkdir(parents=True, exist_ok=True)
    logging.basicConfig(
        filename=log_directory / "english-quest.log",
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
        encoding="utf-8",
    )

    os.environ["ENGLISH_QUEST_DB_PATH"] = str(database_directory / "english_quest.db")
    os.environ["ENGLISH_QUEST_FRONTEND_DIR"] = str(root / "frontend" / "dist")
    base_url = f"http://127.0.0.1:{args.port}"

    if service_is_compatible(base_url):
        if not args.no_browser:
            webbrowser.open(base_url)
        return 0
    if not port_is_available(args.port):
        show_error(
            f"Cổng {args.port} đang được chương trình khác sử dụng. "
            "Hãy đóng chương trình đó rồi mở lại English Quest."
        )
        return 3

    try:
        import uvicorn
        from backend.app.main import app

        if not args.no_browser:
            threading.Thread(target=open_browser_when_ready, args=(base_url,), daemon=True).start()
        logging.info("Starting English Quest at %s with database %s", base_url, os.environ["ENGLISH_QUEST_DB_PATH"])
        uvicorn.run(app, host="127.0.0.1", port=args.port, log_config=None, access_log=False)
        return 0
    except Exception as error:
        logging.exception("English Quest failed to start")
        show_error(f"English Quest không khởi động được: {error}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
