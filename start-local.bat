@echo off
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Nie znaleziono Node.js.
  echo Zainstaluj Node.js albo uruchom projekt przez VS Code Live Server.
  pause
  exit /b 1
)

node server.js
pause
