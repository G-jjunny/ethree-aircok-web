# Aircok 백엔드 (NestJS + Prisma + PostgreSQL)

프론트엔드(Next.js)와 독립적으로 동작하는 관리자 백엔드입니다. API 계약은
`backend-leader` 가 문서화한 스펙으로 프론트와 동기화합니다.

## 도커로 전체 스택 실행 (권장)

레포 루트에서 아래 한 줄이면 **postgres → migrate+seed → NestJS 백엔드** 순서로
전부 기동됩니다.

```bash
docker compose up --build
```

- 백엔드 API: http://localhost:3001 (전역 prefix `/api`)
- Postgres: `localhost:5434` (컨테이너 내부는 `db:5432`)
- `migrate` 서비스가 `prisma migrate deploy` 후 seed 4종(admin/site/partners/faq,
  news, core-values, timeline)을 1회 실행하고 종료합니다. 모든 seed 는 멱등(중복
  실행 안전)하므로 재기동해도 데이터가 중복되지 않습니다.
- DB 데이터는 `aircok-db-data` named volume 에 영속됩니다.

초기화(빈 DB부터 재구축):

```bash
docker compose down -v   # 볼륨까지 삭제
docker compose up --build
```

### 환경변수

시크릿은 `server/.env` 에서 로드합니다(이미지에 포함되지 않음). 최소 필요 키:

```
DATABASE_URL=postgresql://postgres:jjunny@localhost:5434/aircok
ADMIN_SEED_PASSWORD=...
JWT_SECRET=...
CLOUDFLARE_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
R2_PUBLIC_URL=...
R2_PUBLIC_DEV_URL=...
```

> compose 는 컨테이너 네트워크 기준으로 `DATABASE_URL` 을
> `postgresql://postgres:jjunny@db:5432/aircok` 로 오버라이드합니다.
> `.env` 의 `DATABASE_URL` 비밀번호(`jjunny`)와 compose 의 `POSTGRES_PASSWORD`
> 는 **반드시 일치**해야 합니다.

## 프론트엔드

프론트엔드는 도커 대상이 아닙니다. 기존대로 레포 루트에서 네이티브 실행:

```bash
npm run dev   # Next.js dev (localhost:3000)
```

## 로컬 네이티브 개발(백엔드만 네이티브, DB는 도커)

백엔드 프로세스만 네이티브로 실행하고, DB는 이 경로에서도 도커 컨테이너를 사용합니다.

```bash
docker compose up -d db   # DB는 도커 컨테이너로만 실행 (호스트 5434)
npm ci
npx prisma migrate deploy
npm run prisma:seed && npm run prisma:seed:news \
  && npm run prisma:seed:core-values && npm run prisma:seed:timeline
npm run start:dev
```

> 이 경로에서는 compose 의 오버라이드가 적용되지 않고 `server/.env` 의
> `DATABASE_URL`(= `localhost:5434`)이 그대로 사용됩니다. 호스트에서 prisma CLI /
> `npx prisma studio` 를 쓸 때도 기준 포트는 **5434** 입니다.
