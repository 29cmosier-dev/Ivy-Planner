@echo off
cd /d "%~dp0"

git pull origin main

python -m pip install flask werkzeug --quiet

start /b pythonw app.py
exit
