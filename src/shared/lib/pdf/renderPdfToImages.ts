/**
 * PDF 파일을 페이지별 이미지(dataURL)로 렌더링하는 도메인 무관 클라이언트 전용 유틸.
 *
 * pdf.js(`pdfjs-dist`)로 PDF를 로드해 각 페이지를 canvas에 렌더한 뒤
 * `toDataURL`로 PNG dataURL 배열을 반환한다. 2D/3D 뷰어 어느 슬라이스에도
 * 종속되지 않으므로 shared 레이어에 위치한다.
 *
 * 주의:
 * - canvas/Worker는 브라우저 전용이므로 반드시 'use client' 컴포넌트/훅에서만 호출한다.
 * - pdf.js worker는 `import.meta.url` 기준 번들 자산으로 로드한다(Next16/Turbopack 호환).
 * - 동일 출처 프리픽스(`/r2/...` 또는 레거시 `/uploads/...`)로 fetch해 CORS를 회피한다.
 *   cross-origin 절대 URL 전달 금지 — `resolveSameOriginUrl`로 먼저 환원할 것.
 */

let workerConfigured = false

/**
 * pdf.js 모듈을 동적 import하고 worker를 1회 설정한다.
 * SSR에서 실행되지 않도록 호출부에서 클라이언트 전용을 보장해야 한다.
 */
async function loadPdfjs() {
  const pdfjs = await import('pdfjs-dist')
  if (!workerConfigured) {
    // Turbopack/webpack 모두 `new URL(..., import.meta.url)`을 자산으로 인식해
    // worker 파일을 번들·해시 처리한다. CDN 의존이 없어 오프라인/동일출처에서 안전.
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url,
    ).toString()
    workerConfigured = true
  }
  return pdfjs
}

export interface RenderPdfToImagesOptions {
  /**
   * 렌더 배율. 클수록 고해상도지만 메모리/시간이 증가한다.
   * 기본 2(레티나 대응).
   */
  scale?: number
  /** 렌더할 최대 페이지 수(미지정 시 전체). 썸네일 등에서 1로 제한 가능. */
  maxPages?: number
}

/**
 * PDF URL을 받아 페이지별 PNG dataURL 배열을 반환한다.
 *
 * @param url PDF 파일 URL(동일 출처 상대경로 필수, 예: `/r2/catalog/x.pdf` · `/uploads/x.pdf`)
 * @param options 렌더 옵션(scale, maxPages)
 * @returns 페이지 순서대로의 dataURL 배열
 */
export async function renderPdfToImages(
  url: string,
  options: RenderPdfToImagesOptions = {},
): Promise<string[]> {
  const { scale = 2, maxPages } = options
  const pdfjs = await loadPdfjs()

  const loadingTask = pdfjs.getDocument({ url })
  const pdf = await loadingTask.promise
  try {
    const total =
      typeof maxPages === 'number'
        ? Math.min(maxPages, pdf.numPages)
        : pdf.numPages

    const results: string[] = []
    for (let pageNumber = 1; pageNumber <= total; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber)
      const viewport = page.getViewport({ scale })

      const canvas = document.createElement('canvas')
      canvas.width = Math.ceil(viewport.width)
      canvas.height = Math.ceil(viewport.height)
      const context = canvas.getContext('2d')
      if (!context) {
        throw new Error('2D 캔버스 컨텍스트를 생성할 수 없습니다.')
      }

      await page.render({ canvas, canvasContext: context, viewport }).promise
      results.push(canvas.toDataURL('image/png'))
      page.cleanup()
    }
    return results
  } finally {
    // 메모리/worker 자원 해제
    await pdf.cleanup()
    void loadingTask.destroy()
  }
}
