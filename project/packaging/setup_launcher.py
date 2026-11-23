from __future__ import annotations

import argparse
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time

from build_version import APP_VERSION


APP_NAME = "English Quest"
UNINSTALL_KEY = r"Software\Microsoft\Windows\CurrentVersion\Uninstall\EnglishQuest"


def bundled_payload() -> Path:
    frozen_root = getattr(sys, "_MEIPASS", None)
    if frozen_root:
        return Path(frozen_root) / "payload"
    return Path(__file__).resolve().parents[1] / "build" / "windows" / "EnglishQuest"


def default_install_directory() -> Path:
    local_app_data = os.environ.get("LOCALAPPDATA")
    base = Path(local_app_data) if local_app_data else Path.home() / "AppData" / "Local"
    return base / "Programs" / "EnglishQuest"


def validated_install_directory(requested: Path) -> Path:
    resolved = requested.expanduser().resolve()
    expected = default_install_directory().resolve()
    if resolved != expected and os.environ.get("ENGLISH_QUEST_ALLOW_CUSTOM_INSTALL_DIR") != "1":
        raise ValueError(f"Thư mục cài đặt không hợp lệ: {resolved}")
    if resolved == Path(resolved.anchor) or resolved in {Path.home().resolve(), expected.parent}:
        raise ValueError(f"Từ chối thao tác trên thư mục hệ thống: {resolved}")
    return resolved


def message_box(message: str, *, error: bool = False, question: bool = False) -> bool:
    if sys.platform != "win32":
        print(message)
        return True
    import ctypes
    flags = 0x10 if error else 0x40
    if question:
        flags = 0x24
    result = ctypes.windll.user32.MessageBoxW(0, message, APP_NAME, flags)
    return result == 6 if question else True


def stop_running_application() -> None:
    if sys.platform != "win32":
        return
    subprocess.run(
        ["taskkill.exe", "/IM", "EnglishQuest.exe", "/F"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        creationflags=subprocess.CREATE_NO_WINDOW,
        check=False,
    )
    time.sleep(0.4)


def powershell_literal(value: Path | str) -> str:
    return str(value).replace("'", "''")


def manage_shortcuts(install_directory: Path, *, remove: bool = False) -> None:
    if sys.platform != "win32":
        return
    executable = install_directory / "EnglishQuest.exe"
    desktop = "[Environment]::GetFolderPath('Desktop')"
    programs = "[Environment]::GetFolderPath('Programs')"
    if remove:
        command = (
            f"Remove-Item -LiteralPath (Join-Path ({desktop}) '{APP_NAME}.lnk') -Force -ErrorAction SilentlyContinue; "
            f"Remove-Item -LiteralPath (Join-Path ({programs}) '{APP_NAME}.lnk') -Force -ErrorAction SilentlyContinue"
        )
    else:
        exe = powershell_literal(executable)
        workdir = powershell_literal(install_directory)
        command = (
            "$shell=New-Object -ComObject WScript.Shell; "
            f"$desktopLink=$shell.CreateShortcut((Join-Path ({desktop}) '{APP_NAME}.lnk')); "
            f"$desktopLink.TargetPath='{exe}'; $desktopLink.WorkingDirectory='{workdir}'; $desktopLink.Save(); "
            f"$menuLink=$shell.CreateShortcut((Join-Path ({programs}) '{APP_NAME}.lnk')); "
            f"$menuLink.TargetPath='{exe}'; $menuLink.WorkingDirectory='{workdir}'; $menuLink.Save()"
        )
    subprocess.run(
        ["powershell.exe", "-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", command],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        creationflags=subprocess.CREATE_NO_WINDOW,
        check=False,
    )


def write_uninstall_registration(install_directory: Path, version: str) -> None:
    if sys.platform != "win32":
        return
    import winreg
    uninstall = install_directory / "Uninstall.exe"
    estimated_size = sum(path.stat().st_size for path in install_directory.rglob("*") if path.is_file()) // 1024
    with winreg.CreateKey(winreg.HKEY_CURRENT_USER, UNINSTALL_KEY) as key:
        winreg.SetValueEx(key, "DisplayName", 0, winreg.REG_SZ, APP_NAME)
        winreg.SetValueEx(key, "DisplayVersion", 0, winreg.REG_SZ, version)
        winreg.SetValueEx(key, "Publisher", 0, winreg.REG_SZ, "English Quest Family")
        winreg.SetValueEx(key, "InstallLocation", 0, winreg.REG_SZ, str(install_directory))
        winreg.SetValueEx(key, "DisplayIcon", 0, winreg.REG_SZ, str(install_directory / "EnglishQuest.exe"))
        winreg.SetValueEx(key, "UninstallString", 0, winreg.REG_SZ, f'"{uninstall}" --uninstall')
        winreg.SetValueEx(key, "NoModify", 0, winreg.REG_DWORD, 1)
        winreg.SetValueEx(key, "NoRepair", 0, winreg.REG_DWORD, 1)
        winreg.SetValueEx(key, "EstimatedSize", 0, winreg.REG_DWORD, estimated_size)


def remove_uninstall_registration() -> None:
    if sys.platform != "win32":
        return
    import winreg
    try:
        winreg.DeleteKey(winreg.HKEY_CURRENT_USER, UNINSTALL_KEY)
    except FileNotFoundError:
        pass


def install(install_directory: Path, *, launch: bool, shortcuts: bool, register: bool, silent: bool) -> int:
    payload = bundled_payload()
    if not (payload / "EnglishQuest.exe").is_file():
        message_box("Bộ cài bị thiếu tệp EnglishQuest.exe.", error=True)
        return 2

    staging = install_directory.with_name(f"{install_directory.name}.new")
    try:
        if staging.exists():
            shutil.rmtree(staging)
        staging.parent.mkdir(parents=True, exist_ok=True)
        shutil.copytree(payload, staging)
        stop_running_application()
        if install_directory.exists():
            shutil.rmtree(install_directory)
        staging.replace(install_directory)
        shutil.copy2(sys.executable, install_directory / "Uninstall.exe")
        if shortcuts:
            manage_shortcuts(install_directory)
        if register:
            write_uninstall_registration(install_directory, APP_VERSION)
        if launch:
            subprocess.Popen(
                [str(install_directory / "EnglishQuest.exe")],
                cwd=install_directory,
                creationflags=subprocess.CREATE_NO_WINDOW | subprocess.DETACHED_PROCESS,
                close_fds=True,
            )
        if not silent:
            message_box(
                f"Đã cài {APP_NAME} {APP_VERSION}.\n\n"
                "Dữ liệu học sinh được lưu riêng và sẽ được giữ nguyên khi cập nhật."
            )
        return 0
    except Exception as error:
        message_box(f"Không thể cài {APP_NAME}: {error}", error=True)
        return 1
    finally:
        if staging.exists():
            shutil.rmtree(staging, ignore_errors=True)


def uninstall(install_directory: Path, *, shortcuts: bool, register: bool, silent: bool) -> int:
    if not silent and not message_box(
        f"Gỡ {APP_NAME}?\n\nKết quả học tập vẫn được giữ trong Local AppData.", question=True
    ):
        return 0
    stop_running_application()
    if shortcuts:
        manage_shortcuts(install_directory, remove=True)
    if register:
        remove_uninstall_registration()
    if getattr(sys, "frozen", False):
        cleanup_directory = install_directory.parent / ".EnglishQuestInstaller"
        cleanup_directory.mkdir(parents=True, exist_ok=True)
        cleanup_executable = cleanup_directory / "EnglishQuestCleanup.exe"
        shutil.copy2(sys.executable, cleanup_executable)
        subprocess.Popen(
            [
                str(cleanup_executable),
                "--cleanup",
                "--install-dir", str(install_directory),
                "--parent-pid", str(os.getpid()),
                "--silent",
            ],
            creationflags=subprocess.CREATE_NO_WINDOW | subprocess.DETACHED_PROCESS,
            close_fds=True,
        )
    else:
        shutil.rmtree(install_directory, ignore_errors=True)
    if not silent:
        message_box(f"Đã gỡ {APP_NAME}. Dữ liệu học sinh vẫn được giữ lại.")
    return 0


def cleanup_after_uninstall(install_directory: Path, parent_pid: int) -> int:
    for _ in range(40):
        try:
            os.kill(parent_pid, 0)
        except OSError:
            break
        time.sleep(0.25)
    for _ in range(40):
        try:
            if install_directory.exists():
                shutil.rmtree(install_directory)
            break
        except OSError:
            time.sleep(0.25)
    return 0 if not install_directory.exists() else 1


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Install or remove English Quest.")
    parser.add_argument("--install-dir", type=Path, default=default_install_directory())
    parser.add_argument("--uninstall", action="store_true")
    parser.add_argument("--cleanup", action="store_true", help=argparse.SUPPRESS)
    parser.add_argument("--parent-pid", type=int, default=0, help=argparse.SUPPRESS)
    parser.add_argument("--no-launch", action="store_true")
    parser.add_argument("--no-shortcuts", action="store_true")
    parser.add_argument("--no-registry", action="store_true")
    parser.add_argument("--silent", action="store_true")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    try:
        install_directory = validated_install_directory(args.install_dir)
    except ValueError as error:
        message_box(str(error), error=True)
        return 2
    if args.cleanup:
        return cleanup_after_uninstall(install_directory, args.parent_pid)
    if args.uninstall:
        return uninstall(
            install_directory,
            shortcuts=not args.no_shortcuts,
            register=not args.no_registry,
            silent=args.silent,
        )
    return install(
        install_directory,
        launch=not args.no_launch,
        shortcuts=not args.no_shortcuts,
        register=not args.no_registry,
        silent=args.silent,
    )


if __name__ == "__main__":
    raise SystemExit(main())
