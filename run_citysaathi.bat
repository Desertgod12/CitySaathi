@echo off
title CitySaathi 2.0 - Inclusive Smart City Assistant
color 0A
cls
echo ===================================================================
echo     CitySaathi 2.0 - Inclusive Smart City Mission Portal
echo ===================================================================
echo.
echo [1/3] Checking Node.js and Python environment...

cd /d "C:\Users\hp\.gemini\antigravity\scratch\citysaathi"

:: Check if port 5173 is already in use
netstat -ano | findstr ":5173" >nul 2>&1
if %errorlevel% equ 0 (
    echo [*] Frontend is already running on port 5173.
) else (
    echo [*] Launching CitySaathi Frontend (Vite) on http://localhost:5173 ...
    start "CitySaathi-Frontend" /min cmd /c "node node_modules\vite\bin\vite.js --host 0.0.0.0 --port 5173"
)

:: Check if port 8000 is already in use
netstat -ano | findstr ":8000" >nul 2>&1
if %errorlevel% equ 0 (
    echo [*] Backend API is already running on port 8000.
) else (
    echo [*] Launching CitySaathi Backend API (FastAPI) on http://localhost:8000 ...
    start "CitySaathi-Backend" /min cmd /c "python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000"
)

echo.
echo [2/3] Waiting for servers to initialize...
timeout /t 2 /nobreak >nul

echo.
echo [3/3] Opening CitySaathi in your default browser...
start http://localhost:5173

echo.
echo ===================================================================
echo   SUCCESS! CitySaathi 2.0 is actively running.
echo   - Web Portal:   http://localhost:5173  (or http://127.0.0.1:5173)
echo   - Backend API:  http://localhost:8000
echo.
echo   Keep this window open while you use the website.
echo   To stop the servers, simply close this window.
echo ===================================================================
echo.
pause
