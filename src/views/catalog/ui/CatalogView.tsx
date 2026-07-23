'use client'

import dynamic from 'next/dynamic'
import { useQuery } from '@tanstack/react-query'
import { SITE } from '@/shared/config'
import { PageHero } from '@/widgets/page-hero'
import { catalogImageListQueryOptions } from '@/entities/catalog'
import { useCatalogPages } from './useCatalogPages'
import { CatalogDownloadsSection } from './CatalogDownloadsSection'

/**
 * 뷰어 셸(CatalogViewerSection)은 FlipBookViewer(react-pageflip)를 정적 import 해
 * imperative ref 로 제어한다. react-pageflip 은 DOM 직접 접근으로 SSR 대상이 아니고,
 * next/dynamic 은 ref 를 전달하지 않으므로 ref 를 소유한 셸 전체를 client 전용
 * lazy chunk 로 분리한다(초기 번들 제외 + 명령형 API 보존).
 */
function FlipBookPlaceholder() {
  return (
    <div className="flex justify-center py-20">
      {/* token 없음: 960x640 — 플립북 양면(2페이지) 스프레드 고정 캔버스 치수 자리표시자(모바일은 뷰어 축소 렌더에 맞춰 h-[420px]로 완화) */}
      <div className="h-[420px] w-[960px] max-w-full animate-pulse sm:h-[640px] rounded-card-lg bg-surface" />
    </div>
  )
}

const CatalogViewerSection = dynamic(
  () => import('./CatalogViewerSection').then((m) => m.CatalogViewerSection),
  {
    ssr: false,
    loading: () => <FlipBookPlaceholder />,
  },
)

/**
 * /catalog 페이지 조합.
 * PageHero(통일 위젯) + 뷰어 셸 섹션 + 다운로드 섹션을 조합하고,
 * 로딩/에러/빈 상태 분기만 담당한다. CTA·Footer 는 (main) 레이아웃 전역 위젯 제공.
 */
export function CatalogView() {
  const {
    data: images = [],
    isLoading,
    isError,
  } = useQuery(catalogImageListQueryOptions())
  // 이미지/PDF 항목을 페이지 src 배열로 평탄화(PDF는 클라이언트에서 비동기 렌더).
  const { pages, isRendering } = useCatalogPages(images)

  return (
    <>
      <PageHero
        eyebrow={SITE.pages.catalog.hero.label}
        headline={{ prefix: SITE.pages.catalog.title }}
        body={SITE.pages.catalog.description}
      />
      <main className="min-h-screen bg-surface-white">
        <div className="content-container py-16 lg:py-20">
          {isLoading || (isRendering && pages.length === 0) ? (
            <FlipBookPlaceholder />
          ) : isError ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-hairline bg-surface-white px-6 py-20 text-center">
              <p className="text-sm text-ink">카탈로그를 불러오지 못했습니다.</p>
              <p className="text-sm text-muted">잠시 후 다시 시도해 주세요.</p>
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-hairline bg-surface-white px-6 py-20 text-center">
              <p className="text-sm text-ink">등록된 카탈로그가 없습니다.</p>
              <p className="text-sm text-muted">콘텐츠 준비 중입니다.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-12">
              {pages.length > 0 && (
                <CatalogViewerSection pages={pages} images={images} />
              )}
              <CatalogDownloadsSection images={images} />
            </div>
          )}
        </div>
      </main>
    </>
  )
}
