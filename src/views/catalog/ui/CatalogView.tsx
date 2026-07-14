'use client'

import dynamic from 'next/dynamic'
import { useQuery } from '@tanstack/react-query'
import { SITE } from '@/shared/config'
import { PageHero } from '@/widgets/page-hero'
import { catalogImageListQueryOptions } from '@/entities/catalog'
import { useCatalogPages } from './useCatalogPages'

/**
 * FlipBookViewer(및 그 안의 react-pageflip 의존)를 클라이언트 전용 lazy chunk로 분리한다.
 * react-pageflip은 DOM에 직접 접근하므로 SSR 대상이 아니며(ssr:false), 카탈로그 페이지에
 * 진입해 데이터가 준비됐을 때만 로드되어 초기 번들에서 제외된다.
 * 코드 스플리팅을 react-pageflip import가 아닌 FlipBookViewer 경계에서 수행하는 이유:
 * react-pageflip은 flipNext/flipPrev를 위한 명령형 ref를 요구하는데 next/dynamic은 ref를
 * 전달하지 않으므로, ref를 소유한 FlipBookViewer 전체를 분리해 명령형 API를 보존한다.
 */
/**
 * 플립북 로딩 자리표시자 — dynamic import loading과 데이터 로딩 상태에서 공유.
 * 실제 FlipBookViewer 캔버스(2페이지 스프레드) 치수에 맞춰 CLS를 방지한다.
 */
function FlipBookPlaceholder() {
  return (
    <div className="flex justify-center py-20">
      {/* token 없음: 960x640 — 플립북 양면(2페이지) 스프레드 고정 캔버스 치수 자리표시자 */}
      <div className="w-[960px] max-w-full h-[640px] rounded-md bg-surface-light animate-pulse" />
    </div>
  )
}

const FlipBookViewer = dynamic(
  () => import('./FlipBookViewer').then((m) => m.FlipBookViewer),
  {
    ssr: false,
    loading: () => <FlipBookPlaceholder />,
  },
)

/**
 * 방식 A — react-pageflip 기반 2D 플립북 카탈로그 뷰어.
 * react-pageflip 의존은 이 슬라이스(FlipBookViewer)에만 격리되어 있다.
 */
export function CatalogView() {
  const { data: images = [], isLoading, isError } = useQuery(
    catalogImageListQueryOptions(),
  )
  // 이미지/PDF 항목을 페이지 src 배열로 평탄화(PDF는 클라이언트에서 비동기 렌더).
  const { pages, isRendering } = useCatalogPages(images)

  // PDF 다운로드 URL은 향후 계약 확장 시 연결(현재 계약에 없음).
  const downloadUrl: string | null = null

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
            {pages.length > 0 && <FlipBookViewer pages={pages} />}

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
    </>
  )
}
