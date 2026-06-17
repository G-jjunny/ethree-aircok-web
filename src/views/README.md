# views

페이지 단위 조합 (FSD의 "pages" 레이어, Next.js App Router의 pages/와 이름 충돌을 피하기 위해 views로 명명).

Next.js 라우트 파일(`app/**/page.tsx`)은 이 레이어의 컴포넌트를 import해서 렌더링만 한다.
예: `app/login/page.tsx` → `export default function Page() { return <LoginView /> }` (LoginView는 `src/views/login`)

규칙: views는 `shared`, `entities`, `features`, `widgets` 모두 import 가능. 다른 views는 금지.
