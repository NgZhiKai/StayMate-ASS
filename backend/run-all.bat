@echo off
setlocal enabledelayedexpansion
set SERVICES=discovery-service user-service hotel-service booking-service notification-service email-service payment-service api-gateway
set PROFILE=dev
echo Starting all Spring Boot microservices with profile: %PROFILE%
for %%S in (%SERVICES%) do (
	echo Starting %%S ...
	start "%%S" cmd /c "mvn spring-boot:run -Dspring-boot.run.profiles=%PROFILE% -pl %%S"
	if "%%S"=="discovery-service" (
		timeout /t 8 >nul
	) else (
		timeout /t 2 >nul
	)
)
echo All services started (in background windows). Press any key to exit this script window.
pause >nul
