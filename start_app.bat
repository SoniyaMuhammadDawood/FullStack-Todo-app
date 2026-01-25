@echo off
echo Starting the Full-Stack Todo Application...

REM Start the backend server in a new window
echo Starting backend server...
start "Backend Server" cmd /k "cd /d %~dp0\backend && python -c "import sys, os; sys.path.insert(0, './src'); from src.main import app; import uvicorn; print('Backend server starting on http://127.0.0.1:8000'); uvicorn.run(app, host='127.0.0.1', port=8000, log_level='info')""

REM Wait a moment for the backend to start
timeout /t 5 /nobreak >nul

REM Start the frontend server in a new window
echo Starting frontend server...
start "Frontend Server" cmd /k "cd /d %~dp0\frontend && npm run dev"

echo Applications are now running:
echo Frontend: http://localhost:3000
echo Backend: http://127.0.0.1:8000
echo Please check the new command windows for server status.
pause