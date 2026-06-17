---
description: Check FSD architecture compliance
arguments:
  - name: path
    description: "Source directory to check"
    required: false
    default: "src"
---

# FSD Check Command

프로젝트의 Feature-Sliced Design 아키텍처 규칙 준수 여부를 검사합니다.

## Task

### 1. 구조 검사

FSD 레이어 존재 여부 및 슬라이스 구성 확인:
- `app`, `views`, `widgets`, `features`, `entities`, `shared` 레이어 확인
- 각 슬라이스의 `index.ts` (Public API) 존재 여부 확인

### 2. 의존성 규칙 검사

허용된 import 방향: `app → views → widgets → features → entities → shared`

다음 위반 유형을 탐지합니다:

**[ERROR] 레이어 위반** - 역방향 import
```
entities에서 features import
features에서 widgets import
```

**[ERROR] 슬라이스 간 cross-import** - 동일 레이어 내 슬라이스 간 import
```
features/auth에서 features/checkout import
```

**[WARNING] Public API 우회** - index.ts를 통하지 않는 내부 파일 직접 import
```
@/entities/user/ui/UserCard  (❌)
@/entities/user              (✅)
```

### 3. 네이밍 규칙 검사

- 슬라이스: kebab-case (예: `user-profile`, `auth-form`)
- 컴포넌트: PascalCase (예: `UserCard.tsx`)
- 유틸리티 함수: camelCase (예: `formatDate.ts`)

### 4. 보고서 출력

```
FSD Architecture Check Report
==============================

✅ Layer Structure
  - app ✓
  - views ✓
  - widgets ✓
  - features ✓
  - entities ✓
  - shared ✓

❌ Dependency Violations (2 errors)
  ERROR: src/entities/user/api/index.ts
    - Imports from @/features/auth (reverse layer dependency)

⚠️  Warnings (1)
  WARNING: src/features/auth/ui/LoginForm.tsx
    - Direct import bypasses public API: @/entities/user/ui/UserCard.tsx

Summary: 2 errors, 1 warning
```

### 5. Fix 제안 (--fix 옵션)

위반 발견 시 해결 방법 제안:
- 레이어 위반: 상위 레이어에서 조합하거나 공통 로직을 shared/entities로 이동
- Cross-import: widgets에서 조합하거나 Props로 의존성 주입
- Public API 우회: index.ts를 통한 import로 수정

## Usage

```bash
/fsd-check              # src 디렉토리 검사
/fsd-check src          # 경로 지정
/fsd-check src --fix    # 수정 제안 포함
```
