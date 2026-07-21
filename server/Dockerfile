# syntax=docker/dockerfile:1

###############################################################################
# builder — devDependencies 포함 빌드/마이그레이션/시드 실행용 스테이지
#   - npm ci (devDeps 포함) → prisma generate → nest build
#   - docker-compose 의 migrate 서비스가 target: builder 로 이 스테이지를 그대로
#     재사용해 `prisma migrate deploy` + ts-node 기반 seed 스크립트를 실행한다.
###############################################################################
FROM node:22-slim AS builder

# prisma 엔진(debian-openssl-3.0.x) 런타임 의존성
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 의존성 설치 레이어 (소스 변경과 분리해 캐시 활용)
COPY package.json package-lock.json ./
RUN npm ci

# 소스 복사 (.dockerignore 로 node_modules/dist/.env 등 제외)
COPY . .

# prisma client 생성(binaryTargets 반영) + nest build
#   build 스크립트 = "prisma generate && nest build"
RUN npm run build

###############################################################################
# runtime — 프로덕션 실행용 경량 스테이지 (prod deps only)
###############################################################################
FROM node:22-slim AS runtime

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
WORKDIR /app

# node_modules 를 builder 에서 통째로 복사(devDeps 포함). **prune 하지 않는다.**
#
#   [왜 npm prune --omit=dev 를 제거했나]
#   - 프로덕션(Render) 기동 시 docker-entrypoint.sh 가 `prisma migrate deploy` 와
#     ts-node 기반 seed 6종을 실행해야 하는데, 이들은 devDependencies 에 있는
#     prisma CLI / ts-node / typescript / tsconfig-paths / @types/node 를 요구한다.
#   - 특정 패키지만 prune 대상에서 되살리는 방식(node_modules 하위 디렉터리 선택 COPY)은
#     전이 의존성과 .bin 심볼릭 링크가 쉽게 깨져 취약하다.
#   - 따라서 가장 견고한 방법으로 devDeps 를 남긴다. 이미지 크기는 커지지만
#     Render 무료 플랜에서 수용 가능하며, 기동 실패 리스크 제거가 우선이다.
#   - bcrypt 등 네이티브 모듈 바이너리는 builder 에서 빌드된 것을 그대로 재사용한다
#     (runtime 에는 python/make/g++ 가 없으므로 재설치·rebuild 를 하지 않는다).
COPY package.json package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules

# 빌드 산출물 및 런타임 필요 자원 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
# ts-node 기반 seed 실행에 필요(`ts-node --project tsconfig.json`)
COPY --from=builder /app/tsconfig.json ./tsconfig.json
# prisma.config.ts 는 런타임에도 필수다.
#   schema.prisma 의 datasource 블록에는 url 이 없고 prisma.config.ts 의
#   datasource.url(= process.env.DATABASE_URL)에만 존재한다. 이 파일이 없으면
#   docker-entrypoint.sh 첫 줄의 `npx prisma migrate deploy` 가
#   "The datasource.url property is required in your Prisma config file" 로 즉시 실패한다.
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# 시작 스크립트(마이그레이션 + 시드 + 서버 기동)
#   sed: Windows 체크아웃(CRLF)으로 인한 `bad interpreter` 방지용 방어 코드.
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN sed -i 's/\r$//' ./docker-entrypoint.sh && chmod +x ./docker-entrypoint.sh

# 문서화 목적의 기본 포트. 실제 리슨 포트는 PORT 환경변수를 우선한다
# (Render 는 PORT 를 자동 주입하며, main.ts 가 0.0.0.0:$PORT 로 바인딩한다).
# EXPOSE 값이 실제 포트와 달라도 Render 동작에는 영향이 없다.
EXPOSE 3001

# 프로덕션 기본 기동: migrate deploy + seed 6종 + node dist/src/main
# (docker-compose 로컬 스택은 migrate 서비스가 이미 이를 수행하므로
#  server 서비스에서 `command: node dist/src/main` 로 오버라이드한다)
CMD ["./docker-entrypoint.sh"]
