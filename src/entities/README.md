# entities

비즈니스 엔티티(도메인 모델) 단위 슬라이스. 예: `user/`, `product/`, `order/`

각 슬라이스 내부 구조 예시:
```
entities/user/
  api/        # TanStack Query queryOptions, fetcher
  model/      # 타입, zustand store (필요시)
  ui/         # UserCard 등 엔티티 표현 컴포넌트
  index.ts    # public API
```

규칙: entities는 `shared`만 import 가능. 다른 entities, features, widgets, views를 import 금지.
