'use client'

import { useEffect, useState } from 'react'
import { renderPdfToImages } from '@/shared/lib'
import type { CatalogImage } from '@/entities/catalog'

/** 이미지 항목은 백엔드 절대 URL로 보정한다(NewsImage 패턴). */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
function resolveImageSrc(src: string): string {
  return src.startsWith('http') ? src : `${API_BASE}${src}`
}

/** PDF는 동일 출처(`/uploads/...`)로 fetch해 CORS를 회피한다. */
function resolveSameOriginPdfSrc(src: string): string {
  if (!src.startsWith('http')) return src
  try {
    return new URL(src).pathname
  } catch {
    return src
  }
}

/**
 * 카탈로그 항목 배열을 "페이지 이미지 src 배열"로 평탄화한다(3D 텍스처 소비 형태).
 * - image 항목: 단일 페이지(절대 URL)
 * - pdf 항목: shared 유틸 renderPdfToImages로 N페이지 dataURL을 펼침
 *
 * FSD: 두 뷰어 슬라이스는 상호 import 불가하므로 평탄화 훅을 각 슬라이스에 둔다.
 * PDF 렌더 자체는 shared 유틸을 공유한다.
 */
export function useCatalogPages(images: CatalogImage[]): {
  pages: string[]
  isRendering: boolean
} {
  const [pages, setPages] = useState<string[]>([])
  const [isRendering, setIsRendering] = useState(false)

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
                resolveSameOriginPdfSrc(item.fileUrl),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature])

  return { pages, isRendering }
}
