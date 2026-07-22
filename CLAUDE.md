# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소의 코드를 다룰 때 참고하는 가이드입니다.

@AGENTS.md

## 명령어

```bash
npm run dev       # 개발 서버 시작 (Turbopack, localhost:3000)
npm run build     # 프로덕션 빌드
npm start         # 프로덕션 서버 실행
npm run lint      # ESLint 실행
```

> `next build`는 Next.js 16부터 린터를 자동으로 실행하지 않습니다. 린트는 별도로 실행하세요.

## 아키텍처

**Next.js 16.2.9** 프로젝트로, React 19와 TypeScript를 사용하는 **App Router** 기반입니다. 기본 번들러는 Turbopack입니다. 애플리케이션 코드는 `src/` 아래에 **Feature-Sliced Design(FSD)** 구조를 따르며, `app/`은 라우팅 셸 역할만 합니다.

- `app/` — App Router. 모든 라우트는 파일 시스템 기반입니다. 각 세그먼트에서 `layout.tsx`가 `page.tsx`를 감쌉니다. 라우트 파일은 `src/views`(또는 `src/widgets`)에서만 import하고 렌더링만 합니다 — 비즈니스 로직은 여기에 두지 않습니다.
- `app/globals.css` — Tailwind CSS v4 (`@tailwind base/components/utilities` 대신 `@import "tailwindcss"` 문법 사용).
- `public/` — 정적 에셋, 루트 경로로 참조합니다 (`/image.png`).
- `@/*` 경로 별칭은 `./src/*`로 매핑됩니다 (프로젝트 루트가 아님 — FSD 도입 시 변경됨).

### FSD 레이어 (`src/`)

엄격한 단방향 의존성 규칙: 각 레이어는 **아래** 레이어에서만 import할 수 있습니다. 같은 레이어의 슬라이스 간 import(예: `entities` 슬라이스가 다른 `entities` 슬라이스를 import)나 상위 레이어 import는 절대 금지입니다.

```
src/
  app/        # 전역 Provider (QueryProvider 등), app/layout.tsx에서 조합 — 최상위 레이어, 무엇이든 import 가능
  views/      # 페이지 단위 조합 (FSD에서는 "pages"라 부르나, Next.js pages 라우터와 충돌 방지를 위해 이름 변경). widgets/features/entities/shared import 가능
  widgets/    # features+entities로 조합된 독립적인 UI 블록. features/entities/shared import 가능
  features/   # 사용자 시나리오/액션 (폼, 뮤테이션). entities/shared import 가능
  entities/   # 비즈니스 도메인 모델 (엔티티별 api, model, ui). shared만 import 가능
  shared/     # UI 킷, API 클라이언트, lib, config, hooks, stores. 상위 레이어 import 불가.
```

각 슬라이스(예: `entities/user/`)는 `index.ts`를 통해 Public API를 노출합니다 — 다른 레이어는 슬라이스 루트에서만 import해야 하며, 내부 파일 직접 접근은 금지입니다 (슬라이스 외부에서 `entities/user/api/userApi` import 불가).

레이어별 스택 규칙:

- 서버 상태 / 데이터 페칭 → **TanStack Query**, queryOptions는 `entities/*/api` 또는 `features/*/api`에 위치. Provider는 `src/app/providers/query-provider.tsx`.
- 클라이언트/전역 상태 → **zustand**, store는 `entities/*/model` 또는 `features/*/model`에 위치 (크로스커팅 전용 store만 `shared/stores`에 위치).
- 폼 → **react-hook-form** + **zod** (`@hookform/resolvers/zod`), 스키마와 폼은 해당 `features/*` 슬라이스에 함께 위치.

## 이전 Next.js 버전과의 주요 API 차이

**캐싱 (새 모델 — `next.config.ts`에 `cacheComponents: true` 필요):**

- async 함수나 컴포넌트를 캐싱할 때는 `fetch` 캐시 옵션 대신 `'use cache'` 디렉티브를 사용합니다.
- 캐시된 함수 내부에서는 `next/cache`의 `cacheLife()`와 `cacheTag()`를 사용합니다.
- 캐시되지 않은 async 컴포넌트는 반드시 `<Suspense>`로 감싸야 합니다 — 그렇지 않으면 빌드 오류가 발생합니다.
- Server Actions에서 온디맨드 캐시 무효화 시 `revalidateTag()` 대신 `updateTag()`를 사용합니다.
- Server Actions에서 현재 라우트를 갱신할 때 `router.refresh()` 대신 `next/cache`의 `refresh()`를 사용합니다.

**렌더링:**

- `cacheComponents: true` 설정 시 기본 렌더링 모델은 **Partial Prerendering(PPR)**입니다. 정적/캐시된 콘텐츠는 셸에, 런타임 동적 콘텐츠는 `<Suspense>`를 통해 스트리밍됩니다.
- 런타임 API(`cookies()`, `headers()`, `searchParams`, `params`)는 반드시 `await`해야 하며, 이를 사용하는 컴포넌트는 `<Suspense>`로 감싸야 합니다.

**Params/SearchParams:**

- 페이지 컴포넌트의 `params`와 `searchParams`는 이제 **Promise**입니다 — 항상 `await`하세요:
  ```tsx
  export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const { id } = await params;
  }
  ```

**Server Functions (이전 명칭: "Server Actions"):**

- async 함수 내부 또는 파일 상단에 `'use server'` 디렉티브를 선언합니다.
- 모든 Server Function 내부에서 반드시 인증을 검증하세요 — 직접 POST 요청으로 접근 가능합니다.

**린팅:**

- ESLint 9 플랫 설정 (`eslint.config.mjs`) 사용, `.eslintrc` 미사용.
- `next lint` CLI는 제거됨 — `eslint`를 직접 사용합니다.

**스타일링:**

- Tailwind CSS v4: CSS에서 `@import "tailwindcss"` 사용. `@theme inline` 디렉티브로 CSS 변수를 정의합니다.
- 모든 디자인 토큰(색상·간격·radius·shadow·폰트)은 `app/globals.css`의 `@theme inline` 블록에 정의되어 있으며, `design` 에이전트가 단독으로 관리합니다.
- 색상·크기·간격 등의 값은 반드시 정의된 Tailwind 토큰 클래스(`bg-aircok-blue`, `rounded-md` 등)를 사용하고 하드코딩하지 않습니다.

## 백엔드 (`server/`)

별도의 **NestJS + Prisma + PostgreSQL** 백엔드가 같은 저장소의 `server/`에 위치합니다 (모노레포 방식, 아직 스캐폴딩 전). Next.js 프론트엔드와는 독립적입니다 — 공유 타입 패키지는 없으며, 양측이 각자 타입을 작성하고 `backend-leader`가 문서화한 API 계약(OpenAPI 스펙 등)으로 동기화를 유지합니다.

## 콘텐츠 참조 규칙 (WordPress XML)

`docs/smartaircok.WordPress.2026-06-17.xml`은 기존 홈페이지에서 내보낸 WordPress 내보내기 파일입니다.

**참조 범위: 콘텐츠·구조만 허용**

- ✅ 허용: 페이지 구조(섹션 구성, 네비게이션 메뉴 항목), 텍스트 콘텐츠(헤드라인 카피, 본문, 회사 소개, 제품 설명), 파트너사 목록, 연락처 정보
- ❌ 절대 금지: WordPress 테마·플러그인의 색상, 폰트, 레이아웃, 간격, 컴포넌트 스타일을 모방하거나 참고하는 일체의 행위

모든 디자인 결정은 오직 `docs/design.md` 토큰과 Aircok 디자인 시스템을 기준으로 한다. XML의 시각적 표현은 무시한다.

## API 통신 규칙 (axios + TanStack Query)

모든 서버 상태 통신은 **axios 인스턴스 + TanStack Query** 조합만 허용합니다. `fetch()` 직접 호출, `useEffect`+`useState` 데이터패칭 패턴은 금지입니다.

### axios 인스턴스

`src/shared/api/axiosInstance.ts` — 모든 API 호출의 단일 진입점.

- baseURL `/api`, timeout 10s, withCredentials (쿠키 자동 전송)
- 응답 401 → `/console/login` 자동 리다이렉트

```ts
// ❌ 금지
const res = await fetch("/api/news", { credentials: "include" });

// ✅ 필수
import { axiosInstance } from "@/shared/api";
const { data } = await axiosInstance.get("/news");
```

### 레이어별 역할 분리

| 레이어               | 위치                          | 역할                                                                                   |
| -------------------- | ----------------------------- | -------------------------------------------------------------------------------------- |
| **entities/\*/api/** | `queryOptions` + raw API 함수 | GET 데이터 정의. `useQuery`는 직접 사용하지 않음                                       |
| **features/\*/api/** | `useMutation` hooks           | POST/PATCH/DELETE mutation hooks. `useQuery`가 필요하면 entities의 queryOptions 재사용 |
| **widgets/views**    | `useQuery(options)` 호출      | 데이터 소비만. API 함수/fetch 직접 호출 금지                                           |

```ts
// entities/news/api/newsApi.ts — queryOptions 정의
export const newsListQueryOptions = () =>
  queryOptions({
    queryKey: ["news"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/news");
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });

// features/news-editor/api/useDeleteNewsMutation.ts — mutation hook
export function useDeleteNewsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => axiosInstance.delete(`/news/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["news"] }),
  });
}

// views/admin-news/ui/NewsList.tsx — 소비만
const { data } = useQuery(newsListQueryOptions());
const deleteMutation = useDeleteNewsMutation();
```

### 에러 처리 / 공통 메커니즘 (메커니즘은 shared, 도메인 지식은 slice)

API 에러의 **공통 메커니즘**은 `src/shared/api/apiError.ts`에서 단일 관리하고, 도메인별 **메시지·분기**만 각 슬라이스에 둔다. 쿼리키·queryOptions·도메인 메시지를 shared로 모으면 `shared`가 상위 도메인을 알게 되어 **의존성 방향이 역전되므로 금지**한다.

| 항목                                                                         | 위치             | 이유                                          |
| ---------------------------------------------------------------------------- | ---------------- | --------------------------------------------- |
| axios 인스턴스                                                               | `shared/api`     | 도메인 무관 단일 진입점                       |
| 베이스 `ApiError`, `parseAxiosMessages`, `authAwareRetry`                    | `shared/api`     | HTTP 상태 기반 공통 판별/재시도 — 도메인 무관 |
| 도메인 에러 클래스 (`InquiryApiError` 등), 쿼리키, queryOptions, 한글 메시지 | `entities/*/api` | 도메인 정체성. `instanceof`로 슬라이스 분기   |

- 도메인 에러는 베이스 `ApiError`를 **상속**만 한다 (`isAuthError`/`isValidationError`/`isConflict`/`isRateLimited`/`isNotFound`는 베이스 제공):

```ts
// ✅ entities/inquiry/api — 상속만, 도메인 특화가 없으면 빈 클래스
import { ApiError, authAwareRetry, parseAxiosMessages } from "@/shared/api";
export class InquiryApiError extends ApiError {}

// queryOptions의 retry는 공용 정책 재사용
export function adminInquiryQueryOptions() {
  return queryOptions({ /* ... */ retry: authAwareRetry });
}
```

- ❌ 각 슬라이스에서 `status`/`isAuthError`/`parseAxiosMessages`/retry 로직을 복붙 재정의 금지 — 베이스에서 import.

## 서버/클라이언트 번들 경계 규칙

서버 전용 코드가 클라이언트 번들로 유출되면 Next.js 16 렌더 워커가 크래시하며, 이를 SSR에서 실제로 호출하는 동적 라우트가 500을 반환한다. 이 회귀는 과거 커밋 `49ed5b1`과 PR #119(뉴스 동적 라우트)에서 반복 발생했으므로, 아래 규칙으로 재발을 차단한다.

**문제 클래스.** 서버 전용 코드(React `cache()`, `next/cache`의 `'use cache'`/`cacheTag`/`cacheLife`, 서버 사이드 axios 페처 등)를 담은 모듈이 슬라이스 배럴 `index.ts`를 통해 클라이언트 컴포넌트 번들로 유출되면, 그 코드를 SSR에서 실제로 호출하는 동적 라우트가 Next.js 16 렌더 워커 크래시(`Jest worker encountered child process exceptions`)로 500이 난다.

**원인 메커니즘.** 클라이언트 컴포넌트가 배럴에서 client-safe 심볼만 import하더라도, 배럴이 서버 전용 모듈을 함께 re-export하면 번들러가 배럴 그래프 전체(→ 서버 모듈)를 클라이언트 번들로 끌어온다. import는 심볼 단위가 아니라 모듈 그래프 단위로 딸려오기 때문이다.

**규칙 (2가지).**

1. 서버 전용 모듈 최상단에 `import 'server-only';`를 선언해 클라이언트 번들 유입을 빌드 에러로 차단한다.
2. 슬라이스는 두 개의 public 진입점을 갖는다:
   - `index.ts` — **클라이언트 안전 심볼 전용** 배럴. 클라이언트 컴포넌트는 `@/entities/<slice>`(index)에서 import한다.
   - `server.ts` — **서버 전용 심볼 전용** 배럴. 서버 컴포넌트는 `@/entities/<slice>/server`에서 import한다.
   - 서버 전용 심볼(서버 페처, 캐시 태그, `cache()` 래퍼 등)은 절대 `index.ts`에 두지 않는다.
   - 타입 전용 export(`export type`)는 런타임 번들에 영향이 없으므로 편의상 공용 `index.ts`에 유지해도 된다.

**레퍼런스 구현.** `src/entities/news/`가 이 패턴의 기준 예시다.

- `index.ts` — 클라이언트 안전 심볼(queryOptions, 쿼리키, 타입, `revalidateNewsCache` 등)
- `server.ts` — 서버 전용 심볼(`getNewsList`/`getNewsPost`, `NEWS_CACHE_TAG`/`newsPostCacheTag`)
- `api/newsServerFetch.ts` — 최상단 `import 'server-only';` 선언

**린트.** `eslint.config.mjs`의 FSD boundaries는 `index.ts`와 `server.ts` 두 진입점을 모두 슬라이스 public API로 허용한다(`internalPath: "!{index,server}.ts"`). 내부 파일 deep import는 여전히 금지된다.

## 상수 관리 규칙 (하드코딩 금지)

회사명·전화번호·주소·슬로건·SNS 링크 등 반복 사용되는 사이트 메타 정보는 **반드시** `src/shared/config/site.ts`에서 import해 사용한다.
일반적인 내용의 텍스트를 제외하고, 유지보수에 필요한 정보는 컴포넌트 내부에 직접 문자열로 박는 것은 금지다.
그 외에 일반적인 텍스트는 예외.

```ts
// ❌ 금지
<p>전화: 02-6952-1947</p>
<p>스마트 에어콕</p>

// ✅ 필수, api가 없을 시
import { SITE } from '@/shared/config/site'
<p>전화: {SITE.contact.phone}</p>
<p>{SITE.name}</p>
```

`src/shared/config/site.ts`는 `shared` 레이어에 위치하므로 모든 상위 레이어(entities, features, widgets, views, app)에서 import 가능하다.

## FSD 스킬

구현 및 리뷰 서브에이전트(`frontend-implementer`, `frontend-reviewer`)는 위 규칙에 더해 슬라이스 구조와 Public API 규칙에 대해 [feature-sliced/skills FSD 스킬](https://github.com/feature-sliced/skills/tree/master/feature-sliced-design)을 따릅니다.

## 서브에이전트 구조

`.claude/agents/`에 정의된 위임 구조 (design은 orchestrator 직속):

```
orchestrator (Task만 사용, Write 불가)
├── design                  — 디자인 토큰/시스템(Bootstrap), 신규 shared/ui 공용 컴포넌트(Pre), 토큰 정리(Polish). orchestrator 직속
├── frontend-leader
│   ├── frontend-implementer — entities/features/widgets/views 구현
│   └── frontend-reviewer    — lint/typecheck/build + 디자인 & Next.js 규칙 리뷰
└── backend-leader
    ├── backend-api-designer — NestJS 엔드포인트/DTO, Prisma 스키마 설계
    ├── backend-implementer  — NestJS 모듈/서비스/컨트롤러, 마이그레이션
    └── backend-reviewer     — lint/typecheck/build + API 계약 리뷰
```

- `orchestrator`는 위임만 합니다(Task 툴); 파일을 직접 수정하지 않습니다.
- `design`은 frontend-leader 하위가 아니라 **orchestrator 직속** 스페셜리스트입니다. 디자인 토큰/시스템과 shared/ui 공용 컴포넌트(Pre)·토큰 정리(Polish)를 담당하며, frontend-leader가 Pre/Polish가 필요하면 orchestrator에 요청해 design 위임을 받습니다.
- 리더들은 크로스팀 사안(API 계약)을 오케스트레이터에게 올리지 않고 서로 직접 협의합니다.
- 리뷰어(`frontend-reviewer`, `backend-reviewer`)는 직접 문제를 수정하지 않습니다 — 리더에게 보고하고, 리더가 해당 구현자(마크업·토큰 문제는 orchestrator 경유 design)에게 재위임합니다.
- 모든 리더·design → 오케스트레이터, 구현·리뷰 스페셜리스트 → 리더 보고는 `summary`, `changedFiles`, `complianceCheck`, `unresolvedIssues`, `crossTeamNotes` 구조화 스키마를 사용합니다.
- 각 에이전트의 정확한 툴 권한과 책임은 `.claude/agents/*.md`의 frontmatter를 참조하세요.

## views 슬라이스 내 섹션 분리 규칙

- `views/<page>/ui/` 안에서 섹션이 3개 이상이면 섹션별로 파일 분리 필수
- `<PageName>View.tsx`는 섹션 컴포넌트를 조합하는 역할만 하며, 직접 JSX 마크업을 길게 작성하지 않는다
- 섹션 파일 네이밍: `<SectionName>Section.tsx`
