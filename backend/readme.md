# StayMate Backend

Spring Boot microservices backend for StayMate with:
- API Gateway (`api-gateway`)
- Service Discovery (Eureka) (`discovery-service`)
- Domain services (`user`, `hotel`, `booking`, `payment`, `notification`, `email`)

## Architecture

Request flow:
- Frontend -> API Gateway (`http://localhost:8080/api/...`)
- API Gateway -> Services via Eureka (`lb://service-name`)
- Service-to-service calls -> Eureka service names

Services:
- `discovery-service` (Eureka server): `8761`
- `api-gateway`: `8080`
- `user-service`: `8081`
- `hotel-service`: `8082`
- `notification-service`: `8083`
- `booking-service`: `8084`
- `email-service`: `8085`
- `payment-service`: `8086`

## Prerequisites

- Java 17+
- Maven 3.9+
- MySQL 8+
- Windows cmd (for provided `.bat` scripts)

## Local Development (dev profile)

1. Prepare MySQL schema and tables using:
- `backend/mysql-ddl-microservices.sql`

2. Run the DDL script in MySQL:
```bat
mysql -u root -p < mysql-ddl-microservices.sql
```

3. If you are not running as a MySQL admin user:
- Keep `CREATE USER` / `GRANT` lines commented in `mysql-ddl-microservices.sql`.
- Ensure your existing MySQL user matches each service `application-dev.properties` credentials.

4. If you want to use the default dev credentials:
- Uncomment `CREATE USER` / `GRANT` lines in `mysql-ddl-microservices.sql`.
- Run the script with an admin account (for example `root`).

5. From `backend` directory, start all services:
```bat
run-all.bat
```

6. Eureka dashboard:
- `http://localhost:8761`

7. Gateway base URL:
- `http://localhost:8080/api`

Stop all services:
```bat
stop-all.bat
```

### Startup Scripts

The backend includes helper scripts in `backend/`:
- `run-all.bat`: starts `discovery-service`, `api-gateway`, and all domain services with `dev` profile.
- `stop-all.bat`: kills processes bound to backend service ports (`8080-8086`, `8761`).

## API Gateway Routes

Current routes in `api-gateway`:
- `/api/users/**` -> `user-service`
- `/api/bookmarks/**` -> `user-service`
- `/api/hotels/**` -> `hotel-service`
- `/api/rooms/**` -> `hotel-service`
- `/api/reviews/**` -> `hotel-service`
- `/api/bookings/**` -> `booking-service`
- `/api/payments/**` -> `payment-service`
- `/api/notifications/**` -> `notification-service`
- `/api/email/**` -> `email-service`

Examples:
- `GET http://localhost:8080/api/users`
- `GET http://localhost:8080/api/hotels`
- `GET http://localhost:8080/api/reviews/hotel/2`
- `GET http://localhost:8080/api/bookmarks/1`

## CORS

- CORS is configured at API Gateway.
- Service-level CORS configs were removed for gateway-only browser access.
- Frontend should call only gateway endpoints (`/api/...`), not direct service ports.

## Profiles and Environment

Active profile:
- `SPRING_PROFILES_ACTIVE=dev|prod`

Common discovery setting:
- `EUREKA_SERVER_URL` (example: `http://localhost:8761/eureka/`)

Prod essentials:
- `SERVER_PORT`
- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` (for DB-backed services)
- `MAIL_USERNAME`, `MAIL_PASSWORD` (email-service)
- `FRONTEND_HOST_URL` (gateway CORS prod)

Gateway rate-limit env vars:
- `GATEWAY_RATE_LIMIT_ENABLED` (default `true`)
- `GATEWAY_RATE_LIMIT_REPLENISH_TOKENS` (default `60`)
- `GATEWAY_RATE_LIMIT_BURST_CAPACITY` (default `120`)
- `GATEWAY_RATE_LIMIT_WINDOW_SECONDS` (default `60`)

## Build and Test

Build all modules:
```bat
mvn clean install "-Dspring.profiles.active=dev"
```

Compile specific modules:
```bat
mvn -pl api-gateway,user-service,hotel-service,booking-service,notification-service,payment-service,email-service,discovery-service -DskipTests compile
```

Run tests:
```bat
mvn test
```

## Troubleshooting

`404` on gateway endpoint:
- Confirm route exists in `backend/api-gateway/src/main/resources/application.yml`.
- Restart gateway after route changes.

`CORS blocked`:
- Ensure frontend calls `http://localhost:8080/api/...`.
- Confirm gateway CORS config and restart gateway.

Service exits immediately:
- Run service directly to see stacktrace:
```bat
mvn -pl <service-name> spring-boot:run -Dspring-boot.run.profiles=dev
```

Slow responses:
- Wait until all services are registered in Eureka.
- Check downstream service health and DB latency.
