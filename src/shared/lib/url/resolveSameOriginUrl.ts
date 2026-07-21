/**
 * 업로드 파일 URL을 "동일 출처 경로"로 환원하는 도메인 무관 유틸.
 *
 * 배경:
 * - pdf.js는 Range 요청을 포함한 fetch를 수행하므로 cross-origin이면 CORS 설정이 필요하다.
 * - `<a download>` 속성은 cross-origin 리소스에서 브라우저가 무시한다.
 * 두 문제를 모두 피하기 위해 절대 URL을 Next.js rewrites가 프록시하는
 * 동일출처 경로(`/r2/*`, 레거시 `/uploads/*`)로 환원한다.
 *
 * 이 모듈은 `next.config.ts`에서도 상대경로로 import되는 **leaf 모듈**이다.
 * 다른 모듈을 import하지 말 것(설정 로딩이 깨진다).
 */

/**
 * Cloudflare R2 퍼블릭 버킷 호스트.
 * `next.config.ts`의 `images.remotePatterns` 호스트와 `/r2/:path*` rewrite
 * destination이 이 상수를 공유한다(단일 소스).
 * 백엔드 `R2_PUBLIC_URL` 환경변수와 반드시 일치해야 한다.
 */
export const R2_PUBLIC_HOST = 'pub-046c2c24be4d444aaa70d8be1a5cd092.r2.dev'

/** R2 퍼블릭 오리진(스킴 포함). */
export const R2_PUBLIC_ORIGIN = `https://${R2_PUBLIC_HOST}`

/** R2 프록시 rewrite 프리픽스. `/catalog`는 실제 페이지 라우트와 충돌하므로 사용 금지. */
export const R2_PROXY_PREFIX = '/r2'

/**
 * 파일 URL을 동일출처 경로로 환원한다.
 *
 * - 상대경로(`/uploads/x.pdf`): 이미 동일출처이므로 그대로 반환(레거시 하위호환)
 * - R2 절대 URL(`https://pub-xxx.r2.dev/catalog/a.pdf`): `/r2/catalog/a.pdf`
 * - 그 외 절대 URL(레거시 API 오리진): pathname만 반환(`/uploads/a.pdf`)
 * - URL 파싱 실패: 원본 그대로 반환
 */
export function resolveSameOriginUrl(src: string): string {
  if (!src.startsWith('http')) return src
  try {
    const url = new URL(src)
    if (url.origin === R2_PUBLIC_ORIGIN) {
      return `${R2_PROXY_PREFIX}${url.pathname}`
    }
    return url.pathname
  } catch {
    return src
  }
}
