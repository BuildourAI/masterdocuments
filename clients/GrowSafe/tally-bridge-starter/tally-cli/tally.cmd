@echo off
setlocal
if exist "%~dp0runtime\node.exe" (
  "%~dp0runtime\node.exe" "%~dp0bin\tally.mjs" %*
) else (
  node "%~dp0bin\tally.mjs" %*
)
exit /b %ERRORLEVEL%
