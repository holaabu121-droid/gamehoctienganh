import os
from pathlib import Path
import importlib.util
import sys
import tempfile
import unittest
from unittest.mock import patch

from fastapi.routing import APIRoute
from starlette.routing import Mount

from backend.app.main import create_app
from backend.app.version import APP_VERSION


LAUNCHER_PATH = Path(__file__).resolve().parents[2] / "packaging" / "launcher.py"
TEST_TEMP_ROOT = Path(__file__).resolve().parents[2] / ".run" / "packaging-tests"
TEST_TEMP_ROOT.mkdir(parents=True, exist_ok=True)
LAUNCHER_SPEC = importlib.util.spec_from_file_location("english_quest_desktop_launcher", LAUNCHER_PATH)
assert LAUNCHER_SPEC and LAUNCHER_SPEC.loader
LAUNCHER = importlib.util.module_from_spec(LAUNCHER_SPEC)
LAUNCHER_SPEC.loader.exec_module(LAUNCHER)
SETUP_PATH = Path(__file__).resolve().parents[2] / "packaging" / "setup_launcher.py"
sys.path.insert(0, str(SETUP_PATH.parent))
SETUP_SPEC = importlib.util.spec_from_file_location("english_quest_setup_launcher", SETUP_PATH)
assert SETUP_SPEC and SETUP_SPEC.loader
SETUP = importlib.util.module_from_spec(SETUP_SPEC)
SETUP_SPEC.loader.exec_module(SETUP)


class PackagedApplicationTests(unittest.TestCase):
    def test_static_frontend_is_served_without_replacing_api_routes(self) -> None:
        with tempfile.TemporaryDirectory(dir=TEST_TEMP_ROOT) as temporary_directory:
            root = Path(temporary_directory)
            frontend = root / "frontend"
            (frontend / "assets").mkdir(parents=True)
            (frontend / "index.html").write_text("<html>English Quest</html>", encoding="utf-8")
            database = root / "data" / "progress.db"
            with patch.dict(os.environ, {"ENGLISH_QUEST_FRONTEND_DIR": str(frontend)}):
                app = create_app(database)

            api_paths = {route.path for route in app.routes if isinstance(route, APIRoute)}
            mount_paths = {route.path for route in app.routes if isinstance(route, Mount)}
            self.assertIn("/", api_paths)
            self.assertIn("/health", api_paths)
            self.assertIn("/courses", api_paths)
            self.assertIn("/assets", mount_paths)
            self.assertTrue(database.is_file())

    def test_packaged_data_directory_can_be_overridden_for_safe_updates(self) -> None:
        with tempfile.TemporaryDirectory(dir=TEST_TEMP_ROOT) as temporary_directory:
            expected = Path(temporary_directory).resolve()
            self.assertEqual(LAUNCHER.user_data_root(temporary_directory), expected)
            with patch.dict(os.environ, {"ENGLISH_QUEST_DATA_DIR": temporary_directory}):
                self.assertEqual(LAUNCHER.user_data_root(), expected)

    def test_installer_refuses_arbitrary_delete_targets(self) -> None:
        self.assertEqual(SETUP.APP_VERSION, APP_VERSION)
        with tempfile.TemporaryDirectory(dir=TEST_TEMP_ROOT) as temporary_directory:
            local_app_data = Path(temporary_directory)
            with patch.dict(os.environ, {"LOCALAPPDATA": str(local_app_data)}, clear=False):
                expected = local_app_data / "Programs" / "EnglishQuest"
                self.assertEqual(SETUP.validated_install_directory(expected), expected.resolve())
                with self.assertRaises(ValueError):
                    SETUP.validated_install_directory(local_app_data)
                with self.assertRaises(ValueError):
                    SETUP.validated_install_directory(local_app_data / "OtherApplication")


if __name__ == "__main__":
    unittest.main()
