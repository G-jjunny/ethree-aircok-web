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
 * 레거시 `/uploads/*` 정적 파일을 서빙하는 백엔드 API 오리진.
 * `next.config.ts`의 `/uploads/:path*` rewrite destination과 동일한 값을 사용한다
 * (기본값 폴백 포함). 파싱 불가한 값이면 `null`이 되어 pathname 환원을 건너뛴다.
 */
const API_ORIGIN: string | null = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001').origin
  } catch {
    return null
  }
})()

/**
 * 파일 URL을 동일출처 경로로 환원한다.
 *
 * 규칙:
 * - 상대경로(`/uploads/x.pdf`): 이미 동일출처이므로 그대로 반환(레거시 하위호환)
 * - R2 절대 URL(`https://pub-xxx.r2.dev/catalog/a.pdf`): `/r2/catalog/a.pdf`
 * - API 오리진 절대 URL(레거시 `/uploads/*` 서빙 주체): pathname만 반환(`/uploads/a.pdf`)
 * - **그 외 미지 오리진 절대 URL: 원본 그대로 반환**
 * - URL 파싱 실패: 원본 그대로 반환
 *
 * 미지 오리진을 pathname으로 깎지 않는 이유:
 * `R2_PUBLIC_HOST`를 커스텀 도메인으로 교체하면 구 DB 레코드에 남은 `pub-*.r2.dev`
 * URL이 매칭에서 빠지는데, 이때 pathname 폴백이 걸리면 `/catalog/<uuid>.pdf` 같은
 * 존재하지 않는 동일출처 경로로 조용히 404가 난다(이슈 #146에서 고친 실패 모드).
 * 알 수 없는 오리진은 환원하지 않고 원본 절대 URL을 그대로 두어, CORS 오류로
 * 문제가 즉시 드러나게 한다.
 *
 * 주의: pathname만 취하므로 `?search`와 `#hash`는 **의도적으로 폐기**된다.
 * 현재는 퍼블릭 버킷(쿼리 없는 URL) 전제라 무해하나, presigned URL(서명 쿼리 포함)이나
 * 쿼리 기반 변환 파라미터를 도입하면 이 동작을 반드시 재검토해야 한다.
 */
export function resolveSameOriginUrl(src: string): string {
  if (!src.startsWith('http')) return src
  try {
    const url = new URL(src)
    if (url.origin === R2_PUBLIC_ORIGIN) {
      return `${R2_PROXY_PREFIX}${url.pathname}`
    }
    if (API_ORIGIN !== null && url.origin === API_ORIGIN) {
      return url.pathname
    }
    return src
  } catch {
    return src
  }
}
