@echo off
setlocal enabledelayedexpansion
set SERVICES=user-service hotel-service booking-service notification-service email-service
set PROFILE=dev
echo Starting all Spring Boot microservices with profile: %PROFILE%
for %%S in (%SERVICES%) do (
	echo Starting %%S ...
	start "%%S" cmd /c "mvn spring-boot:run -Dspring-boot.run.profiles=%PROFILE% -pl %%S"
	timeout /t 2 >nul
)
echo All services started (in background windows). Press any key to exit this script window.
pause >nul