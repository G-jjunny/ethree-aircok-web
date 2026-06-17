import { QueryProvider } from "./query-provider";

/**
 * 앱 전역 Provider 합성. 새 Provider(테마, 인증 등)가 추가되면 여기서 합성한다.
 * Next.js 루트 app/layout.tsx에서 이 컴포넌트로 children을 감싼다.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
