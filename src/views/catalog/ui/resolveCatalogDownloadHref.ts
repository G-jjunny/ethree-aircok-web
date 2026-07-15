/**
 * 카탈로그 파일 다운로드 href 를 동일출처 경로로 환원한다.
 *
 * `<a download>` 속성은 cross-origin 리소스에서 브라우저가 무시하므로,
 * 절대 URL(`http://host/uploads/x.pdf`)은 pathname(`/uploads/x.pdf`)으로 환원해
 * Next.js rewrites 동일출처 프록시를 통해 내려받게 한다.
 * 상대경로(`/uploads/x.pdf`)는 이미 동일출처이므로 그대로 사용한다.
 * (useCatalogPages.resolveSameOriginPdfSrc 와 동일 아이디어 — 뷰 로컬 유틸.)
 */
export function resolveCatalogDownloadHref(src: string): string {
  if (!src.startsWith('http')) return src
  try {
    return new URL(src).pathname
  } catch {
    return src
  }
}

/**
 * `/uploads/xxxxx.pdf` → `xxxxx.pdf` 처럼 URL 경로에서 파일명만 추출한다.
 * `<a download>` 의 파일명 힌트로 사용(없으면 브라우저 기본 동작).
 */
export function extractFileName(src: string): string | undefined {
  const path = resolveCatalogDownloadHref(src)
  const name = path.split('/').pop()
  return name && name.length > 0 ? name : undefined
}
