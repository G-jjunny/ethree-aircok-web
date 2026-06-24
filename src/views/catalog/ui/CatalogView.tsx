'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { SITE } from '@/shared/config'
import { catalogImageListQueryOptions } from '@/entities/catalog'
import { FlipBookViewer } from './FlipBookViewer'

/**
 * 방식 A — react-pageflip 기반 2D 플립북 카탈로그 뷰어.
 * react-pageflip 의존은 이 슬라이스(FlipBookViewer)에만 격리되어 있다.
 */
export function CatalogView() {
  const { data: images = [], isLoading, isError } = useQuery(
    catalogImageListQueryOptions(),
  )

  // PDF 다운로드 URL은 향후 계약 확장 시 연결(현재 계약에 없음).
  const downloadUrl: string | null = null

  return (
    <main className="min-h-screen bg-surface-white">
      <div className="content-container py-16 lg:py-20">
        <header className="flex flex-col gap-4 mb-10">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h1 className="text-heading-dark font-display text-[40px] font-semibold">
              {SITE.pages.catalog.title}
            </h1>
            {/* 타 뷰어 제거 시(3D 슬라이스/라우트 삭제 시) 이 링크 삭제 */}
            <Link
              href="/catalog/3d"
              className="inline-flex items-center justify-center rounded-md border border-border-light bg-surface-white px-4 py-2 min-h-[44px] text-sm font-medium text-heading-dark hover:bg-surface-light transition-colors"
            >
              3D 뷰어로 보기
            </Link>
          </div>
          <p className="text-body-dark">{SITE.pages.catalog.description}</p>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-20">
            {/* token 없음: 480x640 — 플립북 단일 페이지 기본 비율 자리표시자 */}
            <div className="w-[480px] max-w-full h-[640px] rounded-md bg-surface-light animate-pulse" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border-light bg-surface-white px-6 py-20 text-center">
            <p className="text-nav text-heading-dark">
              카탈로그를 불러오지 못했습니다.
            </p>
            <p className="text-sm text-secondary-dark">
              잠시 후 다시 시도해 주세요.
            </p>
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border-light bg-surface-white px-6 py-20 text-center">
            <p className="text-nav text-heading-dark">
              등록된 카탈로그가 없습니다.
            </p>
            <p className="text-sm text-secondary-dark">
              콘텐츠 준비 중입니다.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8">
            <FlipBookViewer images={images} />

            <a
              href={downloadUrl ?? undefined}
              aria-disabled={downloadUrl === null}
              className={
                downloadUrl === null
                  ? 'inline-flex items-center justify-center rounded-md bg-surface-light px-6 py-3 min-h-[44px] text-sm font-medium text-secondary-dark pointer-events-none cursor-not-allowed'
                  : 'inline-flex items-center justify-center rounded-md bg-aircok-blue px-6 py-3 min-h-[44px] text-sm font-medium text-heading-light hover:bg-aircok-blue-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2'
              }
            >
              {SITE.cta.catalog}
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
