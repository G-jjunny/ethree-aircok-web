# features

사용자 시나리오/액션 단위 슬라이스. 예: `auth/login/`, `post/create-comment/`

각 슬라이스 내부 구조 예시:
```
features/login/
  ui/         # LoginForm (react-hook-form + zod)
  model/      # zustand store, validation schema
  api/        # mutation (TanStack Query)
  index.ts
```

규칙: features는 `shared`, `entities`만 import 가능. 다른 features, widgets, views 금지.
