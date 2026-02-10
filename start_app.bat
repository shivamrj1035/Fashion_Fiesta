@echo off
echo Starting Fashion Fiesta...

REM --- Backend ---
echo Starting Backend...
start "Backend API Server" cmd /k "cd /d "%~dp0backend" && call venv\Scripts\activate && uvicorn main:app --reload"

REM --- Frontend ---
echo Starting Frontend...
start "Frontend Dev Server" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo Done. Both servers should be starting in new windows.
