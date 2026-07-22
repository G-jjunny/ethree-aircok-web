import { resolveSameOriginUrl } from '@/shared/lib'

/**
 * 카탈로그 파일(PDF·이미지) 다운로드 href 를 동일출처 경로로 환원한다.
 *
 * `<a download>` 속성은 cross-origin 리소스에서 브라우저가 무시하므로,
 * 절대 URL 은 Next.js rewrites 동일출처 프록시 경로(`/r2/*`, 레거시 `/uploads/*`)로
 * 환원해 내려받게 한다. 상대경로는 이미 동일출처이므로 그대로 사용한다.
 * 변환 규칙 자체는 shared 유틸이 단일 출처로 관리한다.
 */
export function resolveCatalogDownloadHref(src: string): string {
  return resolveSameOriginUrl(src)
}

/**
 * `/r2/catalog/xxxxx.pdf` → `xxxxx.pdf` 처럼 URL 경로에서 파일명만 추출한다.
 * `<a download>` 의 파일명 힌트로 사용(없으면 브라우저 기본 동작).
 */
export function extractFileName(src: string): string | undefined {
  const path = resolveCatalogDownloadHref(src)
  const name = path.split('/').pop()
  return name && name.length > 0 ? name : undefined
}
