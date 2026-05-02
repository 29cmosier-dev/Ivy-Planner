@echo off
cd /d "%~dp0"

:: Open the browser only once at the start
start chrome "http://127.0.0.1:8000"

:loop
cls
echo ========================================
echo   SYNCING WITH GITHUB...
echo ========================================

:: 1. Pull the latest code
git pull origin main --quiet --no-rebase

:: 2. KILL the old python process if it's running
:: This ensures the NEW app.py code is loaded into RAM
taskkill /f /im python.exe /t >nul 2>&1

:: 3. Ensure dependencies are current
python -m pip install flask werkzeug --quiet

:: 4. Start the NEWLY updated app
echo Starting the updated Flask App...
start /b python app.py

echo.
echo ----------------------------------------
echo   Current version is live. 
echo   Waiting 1 hour for next check...
echo ----------------------------------------

timeout /t 3600 /nobreak
goto loop
