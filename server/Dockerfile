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

# node_modules 를 builder 에서 통째로 복사(devDeps 포함) 후 prod-only 로 정리.
#   - bcrypt 등 네이티브 모듈 바이너리는 builder 에서 이미 빌드된 것을 재사용하므로
#     runtime 에서 재컴파일/재다운로드(python/make/g++ 미보유)가 발생하지 않는다.
#   - npm prune 은 삭제만 수행(재설치·rebuild 없음). --ignore-scripts 로 postinstall 방지.
#   - prune 이 dependencies 를 판별하려면 package.json/package-lock.json 이 먼저 있어야 한다.
COPY package.json package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
RUN npm prune --omit=dev --ignore-scripts

# 빌드 산출물 및 런타임 필요 자원 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# prisma generate 산출물(생성 client) — prune 후에도 확실히 포함되도록 복사
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

EXPOSE 3001

# start 스크립트와 동일: node dist/src/main
CMD ["node", "dist/src/main"]
