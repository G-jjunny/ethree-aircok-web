'use client'

import { useMemo } from 'react'
import { FileText, ImageIcon } from 'lucide-react'
import { SITE } from '@/shared/config'
import { Button } from '@/shared/ui'
import type { CatalogImage } from '@/entities/catalog'
import { resolveCatalogDownloadHref, extractFileName } from './resolveCatalogDownloadHref'

interface CatalogDownloadsSectionProps {
  images: CatalogImage[]
}

const V = SITE.pages.catalog.viewer

interface DownloadItem {
  id: string
  fileType: CatalogImage['fileType']
  href: string
  name?: string
  label: string
  meta: string
}

/**
 * 카탈로그 파일 다운로드 카드 그리드.
 * 메타(제목/크기)가 계약에 없으므로 라벨은 제네릭 + 타입별 순번으로 생성한다.
 * PDF 를 문서로 우선 취급하되 order 순서는 유지한다. 다운로드 파일이 없으면 렌더하지 않는다.
 */
export function CatalogDownloadsSection({ images }: CatalogDownloadsSectionProps) {
  const items = useMemo<DownloadItem[]>(() => {
    const pdfCount = images.filter((i) => i.fileType === 'pdf').length
    const imageCount = images.filter((i) => i.fileType === 'image').length

    return images.map((img, idx) => {
      const isPdf = img.fileType === 'pdf'
      // 앞선 동일 타입 항목 수 + 1 = 타입별 순번(가변 카운터 없이 계산).
      const typeIndex =
        images.slice(0, idx + 1).filter((i) => i.fileType === img.fileType).length
      let label: string
      if (isPdf) {
        // PDF 1건이면 순번 생략, 여러 건이면 순번 부여.
        label = pdfCount > 1 ? `${V.downloadPdfLabel} ${typeIndex}` : V.downloadPdfLabel
      } else {
        label =
          imageCount > 1 ? `${V.downloadImageLabel} ${typeIndex}` : V.downloadImageLabel
      }
      return {
        id: img.id,
        fileType: img.fileType,
        href: resolveCatalogDownloadHref(img.fileUrl),
        name: extractFileName(img.fileUrl),
        label,
        meta: isPdf ? V.fileTypePdf : V.fileTypeImage,
      }
    })
  }, [images])

  if (items.length === 0) return null

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold text-ink">{V.downloadsTitle}</h2>
        <p className="text-sm text-muted">{V.downloadsDescription}</p>
      </div>

      <ul className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-4 rounded-card border border-hairline bg-surface-white p-6"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-btn bg-tint text-brand">
              {item.fileType === 'pdf' ? (
                <FileText className="h-6 w-6" aria-hidden />
              ) : (
                <ImageIcon className="h-6 w-6" aria-hidden />
              )}
            </span>

            <div className="flex flex-col gap-1">
              <span className="font-semibold text-ink">{item.label}</span>
              <span className="text-sm text-muted">{item.meta}</span>
            </div>

            <Button variant="primary" size="sm" asChild className="mt-auto self-start">
              <a href={item.href} download={item.name}>
                {V.downloadCta}
              </a>
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}
