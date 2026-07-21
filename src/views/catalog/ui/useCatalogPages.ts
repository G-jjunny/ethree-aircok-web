'use client'

import { useEffect, useState } from 'react'
import { renderPdfToImages, resolveSameOriginUrl } from '@/shared/lib'
import type { CatalogImage } from '@/entities/catalog'

/** 이미지 항목은 백엔드 절대 URL로 보정한다(NewsImage 패턴, <img>는 cross-origin 허용). */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
function resolveImageSrc(src: string): string {
  return src.startsWith('http') ? src : `${API_BASE}${src}`
}

/**
 * 카탈로그 항목 배열을 "페이지 이미지 src 배열"로 평탄화한다(뷰어 공용 소비 형태).
 * - image 항목: 단일 페이지(절대 URL)
 * - pdf 항목: 동일출처 경로(`/r2/*`, 레거시 `/uploads/*`)로 환원 후
 *   shared 유틸 renderPdfToImages로 N페이지 dataURL을 펼침
 *
 * PDF 렌더는 비동기·클라이언트 전용이므로 로딩 상태를 함께 노출한다.
 */
export function useCatalogPages(images: CatalogImage[]): {
  pages: string[]
  isRendering: boolean
} {
  const [pages, setPages] = useState<string[]>([])
  const [isRendering, setIsRendering] = useState(false)

  // 의존성 키: 항목 식별 + 타입 + URL이 바뀔 때만 재렌더
  const signature = images
    .map((i) => `${i.id}:${i.fileType}:${i.fileUrl}`)
    .join('|')

  useEffect(() => {
    let cancelled = false

    async function build() {
      const hasPdf = images.some((i) => i.fileType === 'pdf')
      if (hasPdf) setIsRendering(true)

      const perItem = await Promise.all(
        images.map(async (item) => {
          if (item.fileType === 'pdf') {
            try {
              return await renderPdfToImages(
                resolveSameOriginUrl(item.fileUrl),
              )
            } catch {
              return [] as string[]
            }
          }
          return [resolveImageSrc(item.fileUrl)]
        }),
      )

      if (cancelled) return
      setPages(perItem.flat())
      setIsRendering(false)
    }

    void build()
    return () => {
      cancelled = true
    }
    // signature가 항목 변경을 대표하므로 images 자체는 의존성에서 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature])

  return { pages, isRendering }
}
