# app

앱 전역 초기화 레이어 (FSD "app" 레이어). Provider, 전역 스타일 결합 등.
Next.js 루트 `app/layout.tsx`에서 이 레이어의 Provider들을 가져와 감싼다.

규칙: app은 모든 레이어를 import 가능 (최상위).
