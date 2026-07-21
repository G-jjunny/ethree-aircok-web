#!/bin/sh
# Render/도커 프로덕션 시작 스크립트.
#
#   1) prisma migrate deploy — 커밋된 마이그레이션만 적용(스키마 드리프트·데이터 삭제 없음).
#      `migrate dev` / `migrate reset` 은 프로덕션에서 절대 사용하지 않는다.
#   2) seed 6종 — 각 seed 는 count/sentinel 멱등 가드가 있어 재기동 시 중복 삽입되지 않는다.
#   3) NestJS 기동.
#
# ⚠ 레거시 /uploads → R2 이관 스크립트(migrate:catalog-team-to-r2)는
#   여기에 절대 추가하지 말 것. 로컬에서 수동 1회만 실행한다.
set -e

npx prisma migrate deploy
npm run prisma:seed
npm run prisma:seed:news
npm run prisma:seed:core-values
npm run prisma:seed:timeline
npm run prisma:seed:media
npm run prisma:seed:air-devices

exec node dist/src/main
