from __future__ import annotations

import os
import sys
from pathlib import Path


def _version_candidates() -> tuple[Path, ...]:
    frozen_root = getattr(sys, "_MEIPASS", None)
    candidates: list[Path] = []
    if frozen_root:
        candidates.append(Path(frozen_root) / "VERSION")
    candidates.append(Path(__file__).resolve().parents[2] / "VERSION")
    return tuple(candidates)


def read_app_version() -> str:
    configured = os.environ.get("ENGLISH_QUEST_VERSION", "").strip()
    if configured:
        return configured
    for candidate in _version_candidates():
        if candidate.is_file():
            value = candidate.read_text(encoding="utf-8-sig").strip()
            if value:
                return value
    return "0.0.0-dev"


APP_VERSION = read_app_version()
