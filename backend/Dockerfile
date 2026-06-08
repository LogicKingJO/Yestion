FROM gradle:8.8-jdk21 AS build

WORKDIR /app

# 의존성 먼저 캐싱 (소스 변경 시 재다운로드 방지)
COPY ./backend/build.gradle ./backend/settings.gradle ./
RUN gradle dependencies --no-daemon || true

# 소스 복사 후 빌드
COPY ./backend/src ./src
RUN gradle bootJar --no-daemon

# ── 실행 이미지 (가볍게) ──────────────────
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
