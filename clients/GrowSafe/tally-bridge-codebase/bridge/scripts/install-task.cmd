@echo off
REM Registers the GrowSafe Tally Bridge to start automatically when this Tally server starts.
REM Run once, as Administrator, from the bridge folder: scripts\install-task.cmd
set BRIDGE_DIR=%~dp0..
schtasks /Create /TN "GrowSafe Tally Bridge" /TR "cmd /c cd /d \"%BRIDGE_DIR%\" && node src\index.js run >> logs\service.log 2>&1" /SC ONSTART /RU SYSTEM /RL HIGHEST /F
if %ERRORLEVEL% NEQ 0 (echo Could not register the task. Run this window as Administrator. & exit /b 1)
echo Registered. Start it now with:  schtasks /Run /TN "GrowSafe Tally Bridge"
