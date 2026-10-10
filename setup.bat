@echo off
echo Setting up EventEaseWeb...

REM Stop any running node processes
taskkill /f /im node.exe 2>nul

REM Clean up old files
if exist eventease.db del eventease.db
if exist node_modules rmdir /s /q node_modules

echo Installing dependencies...
call npm install

echo Starting server...
echo.
echo ========================================
echo EventEaseWeb Setup Complete!
echo ========================================
echo.
echo Run the following commands:
echo 1. npm run dev    - Start the development server
echo 2. Open browser: http://localhost:3001
echo.
echo Demo Credentials:
echo   Admin: admin@example.com / Admin@123
echo   User:  user@example.com  / User@123
echo.
pause