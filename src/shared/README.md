# shared

가장 하위 레이어. 다른 레이어를 import 하지 않는다 (의존 없음).

- `ui/` — 비즈니스 로직 없는 순수 UI 컴포넌트 (Button, Input, Card 등)
- `api/` — fetch 클라이언트, TanStack Query QueryClient 설정, 공통 API 유틸
- `lib/` — 순수 함수, 포맷터, 헬퍼
- `config/` — 환경변수, 상수
- `hooks/` — 범용 React hooks (entities/features에 종속되지 않는 것만)
- `stores/` — zustand 등 전역 스토어 중 도메인에 종속되지 않는 것만
- `types/` — 전역 공통 타입

각 하위 폴더는 `index.ts`로 public API만 export한다.
