@echo off
setlocal

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\start_english_quest.ps1"
if errorlevel 1 (
  echo.
  echo Khong the khoi dong English Quest. Xem thong bao loi phia tren.
  pause
)

endlocal
