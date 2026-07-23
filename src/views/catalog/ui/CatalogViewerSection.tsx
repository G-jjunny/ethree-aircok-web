'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Maximize,
  Minimize,
  Minus,
  Plus,
} from 'lucide-react'
import { SITE } from '@/shared/config'
import { Button } from '@/shared/ui'
import type { CatalogImage } from '@/entities/catalog'
import { FlipBookViewer } from './FlipBookViewer'
import type {
  FlipBookViewerHandle,
  FlipBookViewerState,
} from './FlipBookViewer'
import { resolveCatalogDownloadHref, extractFileName } from './resolveCatalogDownloadHref'

interface CatalogViewerSectionProps {
  /** 평탄화된 페이지 이미지 src 배열(이미지 항목 + PDF 분해 페이지). */
  pages: string[]
  /** 원본 카탈로그 항목 — 대표 PDF 다운로드 대상 판별에 사용. */
  images: CatalogImage[]
}

const V = SITE.pages.catalog.viewer

/**
 * 다크 navy 뷰어 셸. 툴바(줌·전체화면·PDF 다운로드)·북 영역(glass 화살표)·
 * 푸터(페이지 인디케이터·슬라이더)를 소유하고, 순수 캔버스인 FlipBookViewer를
 * imperative ref + onStateChange 로 제어한다. 전체화면은 이 셸 컨테이너 기준.
 */
export function CatalogViewerSection({ pages, images }: CatalogViewerSectionProps) {
  const shellRef = useRef<HTMLDivElement | null>(null)
  const viewerRef = useRef<FlipBookViewerHandle | null>(null)

  const [state, setState] = useState<FlipBookViewerState>({
    currentStartPage: 0,
    currentEndPage: 0,
    totalPages: 0,
    orientation: 'landscape',
    zoom: 1,
  })
  const [isFullscreen, setIsFullscreen] = useState(false)

  // 대표 PDF(첫 PDF 항목) → 동일출처 다운로드 href. 없으면 버튼 숨김.
  const pdfDownload = useMemo(() => {
    const firstPdf = images.find((i) => i.fileType === 'pdf')
    if (!firstPdf) return null
    return {
      href: resolveCatalogDownloadHref(firstPdf.fileUrl),
      name: extractFileName(firstPdf.fileUrl),
    }
  }, [images])

  // onStateChange 는 FlipBookViewer effect 의존성이므로 안정 참조로 고정.
  const handleStateChange = useCallback((next: FlipBookViewerState) => {
    setState(next)
  }, [])

  // 전체화면: 셸 컨테이너 기준 requestFullscreen/exitFullscreen + 상태 동기화.
  const toggleFullscreen = useCallback(() => {
    const el = shellRef.current
    if (!el) return
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void el.requestFullscreen?.()
    }
  }, [])

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === shellRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const zoomPercent = Math.round(state.zoom * 100)
  const hasPages = state.totalPages > 0
  // 슬라이더/인디케이터는 1-based 콘텐츠 페이지 기준(min 1 … max 총 페이지 수).
  const sliderMax = Math.max(1, state.totalPages)
  // 현재 보고 있는 콘텐츠 페이지 표기: 양면 스프레드면 범위("4–5"), 단면이면 단일("4").
  const pageLabel = !hasPages
    ? '–'
    : state.currentStartPage === state.currentEndPage
      ? String(state.currentStartPage)
      : `${state.currentStartPage}–${state.currentEndPage}`

  return (
    <section className="flex flex-col gap-4">
      <div
        ref={shellRef}
        className="overflow-hidden rounded-card-lg bg-navy shadow-brand"
      >
        {/* 툴바 */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-btn bg-white/7 text-cyan">
              <FileText className="h-5 w-5" aria-hidden />
            </span>
            <span className="flex flex-col">
              <span className="font-bold text-white">{V.title}</span>
              <span className="text-sm text-white/60">{V.subtitle}</span>
            </span>
          </div>

          {/* 모바일(360px): 줌(152)+전체화면(44)+PDF(~130)+gap ≈ 340px > 유효폭 320px — wrap 허용으로 두 줄 배치(#155) */}
          <div className="flex flex-wrap items-center justify-end gap-2">
            {/* 줌 컨트롤 (− / % / +) */}
            <div className="flex items-center gap-1">
              <GlassButton onClick={() => viewerRef.current?.zoomOut()} label={V.zoomOutLabel}>
                <Minus className="h-4 w-4" aria-hidden />
              </GlassButton>
              <button
                type="button"
                onClick={() => viewerRef.current?.resetZoom()}
                aria-label={V.resetZoomLabel}
                className="min-w-14 rounded-btn px-2 py-2 text-center text-sm font-medium text-white/85 hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {zoomPercent}%
              </button>
              <GlassButton onClick={() => viewerRef.current?.zoomIn()} label={V.zoomInLabel}>
                <Plus className="h-4 w-4" aria-hidden />
              </GlassButton>
            </div>

            {/* 전체화면 */}
            <GlassButton
              onClick={toggleFullscreen}
              label={isFullscreen ? V.exitFullscreenLabel : V.fullscreenLabel}
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4" aria-hidden />
              ) : (
                <Maximize className="h-4 w-4" aria-hidden />
              )}
            </GlassButton>

            {/* 대표 PDF 다운로드 */}
            {pdfDownload && (
              <Button variant="primary" size="sm" asChild>
                <a href={pdfDownload.href} download={pdfDownload.name}>
                  <Download className="h-4 w-4" aria-hidden />
                  {V.downloadPdfCta}
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* 북 영역 (다크 radial) + 좌우 glass 화살표 */}
        <div
          className="relative flex items-center justify-center px-4 py-8 sm:px-12 lg:px-16"
          style={{
            // token 없음: radial 좌표(120% 90% at 78% 0%)는 배경 패턴 정의 자체 — 색상은 토큰 var 사용
            background:
              'radial-gradient(120% 90% at 78% 0%, var(--color-navy-tint), var(--color-navy) 55%, var(--color-navy-deep) 100%)',
          }}
        >
          <button
            type="button"
            onClick={() => viewerRef.current?.flipPrev()}
            aria-label={V.prevLabel}
            className="absolute left-1 z-10 flex h-11 w-11 sm:left-3 items-center justify-center rounded-full border border-white/12 bg-white/7 text-white backdrop-blur hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>

          <FlipBookViewer
            ref={viewerRef}
            pages={pages}
            onStateChange={handleStateChange}
          />

          <button
            type="button"
            onClick={() => viewerRef.current?.flipNext()}
            aria-label={V.nextLabel}
            className="absolute right-1 z-10 flex h-11 w-11 sm:right-3 items-center justify-center rounded-full border border-white/12 bg-white/7 text-white backdrop-blur hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* 푸터바: 페이지 인디케이터 + 진행 슬라이더 + 총 페이지 */}
        <div className="flex items-center gap-4 border-t border-white/8 px-5 py-4">
          {/* min-w-12(48px): 표기값(–/1/4–5/10–11)이 바뀌어도 span 폭 고정 → 옆 flex-1 슬라이더 밀림 방지. text-center 로 라벨 정렬 안정화. */}
          <span className="min-w-12 text-center font-display text-sm text-white/85 tabular-nums">
            {pageLabel}
          </span>
          <input
            type="range"
            min={1}
            max={sliderMax}
            value={hasPages ? (Number.isFinite(state.currentStartPage) ? state.currentStartPage : 1) : 1}
            disabled={!hasPages}
            onChange={(e) => viewerRef.current?.goToPage(Number(e.target.value))}
            aria-label={V.title}
            // 트랙 brand→cyan 그라디언트 + 대비 썸: globals.css `catalog-range` 유틸(webkit/moz 의사요소)에서 토큰 var 로 정의
            className="catalog-range h-4 flex-1 cursor-pointer appearance-none bg-transparent disabled:cursor-not-allowed disabled:opacity-40"
          />
          <span className="whitespace-nowrap text-sm text-white/60 tabular-nums">
            / 총 {state.totalPages}페이지
          </span>
        </div>
      </div>

      {/* 헬퍼 노트 */}
      <p className="text-sm text-muted">{V.helperNote}</p>
    </section>
  )
}

/** 다크 셸 위 glass 아이콘 버튼(44px 터치타겟). */
function GlassButton({
  onClick,
  label,
  children,
}: {
  onClick: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-btn border border-white/12 bg-white/7 text-white hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      {children}
    </button>
  )
}
