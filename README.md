# Aircok

스마트 에어콕(Aircok) 회사 소개 및 제품 홈페이지 + 관리자 콘솔. **Next.js 16(App Router) 프론트엔드**와 **NestJS + Prisma + PostgreSQL 백엔드**로 구성된 모노레포입니다.

## 스택

**프론트엔드** (`/`)

- Next.js 16.2.9 (App Router, Turbopack, `cacheComponents`/PPR)
- React 19, TypeScript
- Tailwind CSS v4
- TanStack Query (서버 상태), zustand (클라이언트 상태)
- react-hook-form + zod (폼)
- Feature-Sliced Design(FSD) 아키텍처

**백엔드** (`/server`)

- NestJS 10
- Prisma 7 + PostgreSQL
- JWT 인증 (passport-jwt / passport-local)
- Cloudflare R2 (이미지/파일 스토리지), Nodemailer (문의 알림 메일)

## 디렉터리 구조

```
app/                  # Next.js App Router — 라우팅 셸 (레이아웃/페이지만, 로직 없음)
  (main)/             # 공개 페이지: 홈, about, services, catalog, news, faq, contact ...
  console/            # 관리자 콘솔 페이지 (/console/*)
src/                  # FSD 레이어 — 실제 구현
  app/                # 전역 Provider (QueryProvider 등)
  views/              # 페이지 단위 조합
  widgets/            # features+entities로 조합된 UI 블록
  features/           # 사용자 시나리오 (폼, 뮤테이션)
  entities/           # 비즈니스 도메인 모델 (api/model)
  shared/             # UI 킷, axios 인스턴스, config, hooks, stores
server/               # NestJS + Prisma 백엔드 (독립 프로젝트)
  src/                # 도메인별 모듈 (auth, news, catalog, faq, inquiry ...)
  prisma/             # 스키마 및 마이그레이션
docs/
  design.md           # 디자인 토큰/일관성 가이드 (design 서브에이전트 전용)
  smartaircok.WordPress.*.xml  # 기존 홈페이지 콘텐츠 참고용 (디자인은 참고 금지)
```

프론트엔드/백엔드는 공유 타입 패키지 없이 독립적으로 개발되며, API 계약으로만 동기화됩니다. 상세 아키텍처 규칙은 [`CLAUDE.md`](./CLAUDE.md), Next.js 16 관련 breaking change는 [`AGENTS.md`](./AGENTS.md)를 참고하세요.

## 시작하기

### 사전 요구사항

- Node.js 20+
- PostgreSQL

### 프론트엔드

```bash
npm install
cp .env.local.example .env.local   # API_URL 등 설정
npm run dev       # http://localhost:3000 (Turbopack)
npm run build     # 프로덕션 빌드
npm start         # 프로덕션 서버 실행
npm run lint      # ESLint (next build는 자동으로 린트하지 않음)
```

### 백엔드 (`server/`)

```bash
cd server
npm install
cp .env.example .env               # DATABASE_URL, JWT_SECRET 등 설정
npm run prisma:generate
npm run prisma:migrate
npm run start:dev                  # http://localhost:3001
```

프론트엔드는 `next.config.ts`의 `rewrites()`를 통해 `/api/*`, `/uploads/*` 요청을 백엔드(`API_ORIGIN`, 기본 `http://localhost:3001`)로 프록시합니다.

## 아키텍처 요약

- **FSD 레이어 규칙**: 각 레이어는 아래 레이어만 import 가능 (`app → views → widgets → features → entities → shared`). 같은 레이어 슬라이스 간 import 금지, 슬라이스는 `index.ts`로만 공개.
- **API 통신**: `axios` 인스턴스(`src/shared/api`) + TanStack Query 조합만 허용. `fetch()` 직접 호출 금지.
- **상수 관리**: 회사명/연락처 등 사이트 메타 정보는 `src/shared/config/site.ts`에서 import (하드코딩 금지).
- **디자인 토큰**: 모든 색상/간격/타이포그래피는 `app/globals.css`의 `@theme inline` 및 `docs/design.md` 기준.

자세한 규칙과 서브에이전트 위임 구조는 [`CLAUDE.md`](./CLAUDE.md)를 참고하세요.
