---
name: applying-fsd-architecture
description: Feature-Sliced Design(FSD) 아키텍처를 적용한 프론트엔드 프로젝트 개발 지원. FSD 레이어, 슬라이스, 세그먼트 구조 설계, 의존성 규칙 적용, 마이그레이션 시 사용.
---

# Feature-Sliced Design Architecture Skill

Feature-Sliced Design(FSD) 아키텍처를 적용한 프론트엔드 프로젝트 개발을 지원합니다.

## Description

이 스킬은 FSD 아키텍처에 대한 깊은 이해를 바탕으로 개발자가 올바른 구조를 설계하고 유지할 수 있도록 돕습니다. 레이어, 슬라이스, 세그먼트의 개념과 의존성 규칙을 적용하여 확장 가능하고 유지보수가 쉬운 코드베이스를 구축합니다.

## When to Use

이 스킬은 다음과 같은 상황에서 자동으로 활성화됩니다:

- FSD 아키텍처 관련 질문 (레이어, 슬라이스, 세그먼트)
- 프로젝트 폴더 구조 설계
- 의존성 규칙 및 import 방향 문의
- shared, entities, features, widgets, views 등의 레이어 사용법
- FSD 마이그레이션 또는 리팩토링

## Core Concepts

### 레이어 (Layers)

이 프로젝트의 FSD 레이어 (상위 → 하위):

1. **app** - 전역 Provider, app/layout.tsx에서 조합 (`src/app/`)
2. **views** - 페이지 단위 조합 (FSD 표준 명칭 "pages"를 Next.js 충돌 방지를 위해 변경) (`src/views/`)
3. **widgets** - features+entities로 구성된 독립적 UI 블록 (`src/widgets/`)
4. **features** - 사용자 시나리오/액션, 폼, 뮤테이션 (`src/features/`)
5. **entities** - 비즈니스 도메인 모델, 엔티티별 api/model/ui (`src/entities/`)
6. **shared** - UI 킷, API 클라이언트, lib, config, hooks, stores (`src/shared/`)

### 의존성 규칙

```
app → views → widgets → features → entities → shared
```

- 상위 레이어는 하위 레이어만 import 가능
- 같은 레이어 내 슬라이스 간 import 금지 (cross-slice 금지)
- 각 슬라이스는 `index.ts`로 Public API를 노출 — 외부에서 내부 파일 직접 import 금지

### 세그먼트 (Segments)

슬라이스 내부 구조:

- `ui/` - UI 컴포넌트, 스타일
- `api/` - TanStack Query queryOptions, API 요청 함수
- `model/` - zustand store, 비즈니스 로직, 타입
- `lib/` - 유틸리티 함수
- `config/` - 설정값

### 슬라이스 구조 예시

**entities/{name}/**
```
index.ts        ← Public API
ui/index.ts
model/types.ts
model/index.ts
api/index.ts
```

**features/{name}/**
```
index.ts        ← Public API
ui/index.ts
model/index.ts
api/index.ts
```

**widgets/{name}/**
```
index.ts        ← Public API
ui/index.ts
```

### Public API 규칙

```typescript
// 올바른 import (슬라이스 루트)
import { UserCard } from '@/entities/user'

// 잘못된 import (내부 직접 접근) ❌
import { UserCard } from '@/entities/user/ui/UserCard'
```

### 스택 규칙

- 서버 상태/데이터 페칭: **TanStack Query** — queryOptions는 `entities/*/api` 또는 `features/*/api`
- 클라이언트/전역 상태: **zustand** — `entities/*/model` 또는 `features/*/model` (크로스컷팅만 `shared/stores`)
- 폼: **react-hook-form + zod** — 스키마와 폼은 해당 `features/*` 슬라이스에 함께 위치

## External Documentation

```
https://feature-sliced.design/kr/docs/get-started/overview
https://feature-sliced.design/kr/docs/reference/layers
https://feature-sliced.design/kr/docs/reference/slices-segments
```
