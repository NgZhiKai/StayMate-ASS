@echo off
setlocal enabledelayedexpansion
echo Stopping all Staymate microservices...
echo.

:: List of service ports (adjust as needed)
set PORTS=8081 8082 8083 8084 8085 8086

:: Loop through each port and kill the process
for %%p in (%PORTS%) do (
    echo Checking port %%p...
    set "found=0"
    for /f "tokens=5" %%i in ('netstat -ano ^| findstr :%%p') do (
        echo   Found process ID %%i on port %%p - killing...
        taskkill /F /PID %%i >nul 2>&1
        if !errorlevel! equ 0 (
            echo   Successfully killed process %%i
        ) else (
            echo   Failed to kill process %%i
        )
        set "found=1"
    )
    if !found! equ 0 (
        echo   No process found on port %%p
    )
    echo.
)

echo All microservices have been stopped (or were not running).
echo Press any key to exit.
pause >nul