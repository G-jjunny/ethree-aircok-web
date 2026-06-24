'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useQuery } from '@tanstack/react-query'
import { SITE } from '@/shared/config'
import { catalogImageListQueryOptions } from '@/entities/catalog'
import { useCatalogPages } from './useCatalogPages'

/**
 * 방식 B — three / @react-three/fiber / @react-three/drei 기반 3D 카탈로그 뷰어.
 * WebGL Canvas는 SSR이 불가하므로 3D 씬은 ssr:false 동적 import로 로드한다.
 * three 관련 의존은 Catalog3dScene(이 슬라이스)에만 격리되어 있다.
 */
const Catalog3dScene = dynamic(() => import('./Catalog3dScene'), {
  ssr: false,
  loading: () => (
    // token 없음: max-w-[900px] aspect-[16/10] — 3D 카탈로그 캔버스 고정 폭·비율(WebGL 뷰포트 전용 1회성 수치)
    <div className="w-full max-w-[900px] aspect-[16/10] rounded-xl bg-surface-light animate-pulse" />
  ),
})

export function Catalog3dView() {
  const { data: images = [], isLoading, isError } = useQuery(
    catalogImageListQueryOptions(),
  )
  const { pages, isRendering } = useCatalogPages(images)

  return (
    <main className="min-h-screen bg-surface-white">
      <div className="content-container py-16 lg:py-20">
        <header className="flex flex-col gap-4 mb-10">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h1 className="text-heading-dark font-display text-[40px] font-semibold">
              {SITE.pages.catalog.title} (3D)
            </h1>
            {/* 타 뷰어 제거 시(2D catalog 슬라이스/라우트 삭제 시) 이 링크 삭제 */}
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center rounded-md border border-border-light bg-surface-white px-4 py-2 min-h-[44px] text-sm font-medium text-heading-dark hover:bg-surface-light transition-colors"
            >
              2D 책자로 보기
            </Link>
          </div>
          <p className="text-body-dark">{SITE.pages.catalog.description}</p>
        </header>

        {isLoading || (isRendering && pages.length === 0) ? (
          <div className="flex justify-center py-20">
            {/* token 없음: max-w-[900px] aspect-[16/10] — 3D 카탈로그 캔버스 고정 폭·비율(WebGL 뷰포트 전용 1회성 수치) */}
            <div className="w-full max-w-[900px] aspect-[16/10] rounded-xl bg-surface-light animate-pulse" />
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
            <p className="text-sm text-secondary-dark">콘텐츠 준비 중입니다.</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <Catalog3dScene pages={pages} />
          </div>
        )}
      </div>
    </main>
  )
}
