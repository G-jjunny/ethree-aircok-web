'use client'

import { forwardRef, useMemo, useRef } from 'react'
import type { ComponentType, CSSProperties, ReactNode } from 'react'
import HTMLFlipBookDefault from 'react-pageflip'

/**
 * react-pageflip의 HTMLFlipBook IProps는 모든 설정 필드를 required로 선언하지만
 * 런타임은 누락 필드에 기본값을 채운다. 실사용 가능한 partial props 타입으로
 * 좁혀 캐스팅한다(라이브러리 타입 정의 한계 회피).
 */
type FlipBookProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
  width?: number
  height?: number
  size?: 'fixed' | 'stretch'
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
  showCover?: boolean
  mobileScrollSupport?: boolean
  drawShadow?: boolean
  flippingTime?: number
  usePortrait?: boolean
  maxShadowOpacity?: number
  ref?: unknown
}

const FlipBook = HTMLFlipBookDefault as unknown as ComponentType<FlipBookProps>

/**
 * 단일 페이지 폭(px). 양면 스프레드의 한 쪽 페이지 크기 기준값이다.
 * react-pageflip은 width/height를 px 수치로만 받으므로 인라인 수치가 불가피하다.
 */
const PAGE_WIDTH = 480
const PAGE_HEIGHT = 640
/** 양면(스프레드) 한 쪽 최소/최대 폭 — landscape 전환 임계값 계산에 사용. */
const PAGE_MIN_WIDTH = 320
const PAGE_MAX_WIDTH = 560

/**
 * 페이지 슬롯. 실제 카탈로그 이미지 또는 양면 정렬을 위한 빈 페이지(blank)를 렌더한다.
 * react-pageflip 자식은 ref를 받을 수 있는 컴포넌트여야 하므로 forwardRef로 정의한다.
 */
const Page = forwardRef<
  HTMLDivElement,
  { src: string | null; pageNumber: number; total: number }
>(function Page({ src, pageNumber, total }, ref) {
  return (
    <div
      ref={ref}
      className="bg-surface-white flex items-center justify-center overflow-hidden"
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`카탈로그 ${pageNumber}/${total} 페이지`}
          className="w-full h-full object-contain"
        />
      ) : (
        // 양면 정렬용 빈 페이지(뒤표지를 단독 면으로 보내기 위한 패딩)
        <div className="w-full h-full bg-surface-white" aria-hidden />
      )}
    </div>
  )
})

interface FlipBookViewerProps {
  /** 평탄화된 페이지 이미지 src 배열(이미지 항목 + PDF 분해 페이지). */
  pages: string[]
}

export function FlipBookViewer({ pages }: FlipBookViewerProps) {
  // HTMLFlipBook 인스턴스 ref — 외부 페이지 이동 버튼에서 사용
  const bookRef = useRef<{
    pageFlip: () => { flipNext: () => void; flipPrev: () => void }
  } | null>(null)

  /**
   * 실제 책처럼 보이게 하는 페이지 슬롯 구성.
   * react-pageflip은 showCover=true일 때 landscape에서
   *   [표지] → [좌,우] → [좌,우] → ... 순으로 스프레드를 만들고,
   * 마지막 페이지가 홀로 남을 때만 단독(뒤표지)으로 렌더한다.
   * 표지(1) 다음 본문 페이지 수가 홀수이면 마지막 페이지가 다른 페이지와 짝을 이뤄
   * 뒤표지가 단독으로 오지 않는다. 이 경우 마지막 페이지 직전에 빈 페이지를 1장 삽입해
   * 뒤표지가 홀로 떨어지도록 보정한다(전체 슬롯 수를 짝수로 맞춤).
   */
  const slots = useMemo<(string | null)[]>(() => {
    if (pages.length <= 1) return pages
    // 전체 슬롯 수가 홀수이면 표지를 제외한 본문이 짝이 맞지 않아 뒤표지가 단독으로 오지 않는다.
    if (pages.length % 2 === 1) {
      return [...pages.slice(0, -1), null, pages[pages.length - 1]]
    }
    return pages
  }, [pages])

  return (
    <div className="flex flex-col items-center gap-6">
      {/*
        flipbook 래퍼: react-pageflip(stretch)은 부모 폭이 minWidth*2 이상이면
        landscape(양면 스프레드), 그보다 좁으면 usePortrait에 의해 portrait(단면)로 전환된다.
        데스크톱에서 양면이 되도록 부모 폭을 한 쌍(약 2페이지) 기준으로 명시하고,
        좁은 화면에서는 단면으로 자연스럽게 폴백되게 한다.
        token 없음: 픽셀 폭 — react-pageflip이 부모 offsetWidth로 orientation을 계산하므로
        양면 스프레드 임계값(PAGE_MIN_WIDTH*2 이상)을 맞추기 위한 불가피한 수치.
      */}
      <div className="w-full max-w-[1120px] lg:min-w-[680px]">
        <FlipBook
          ref={bookRef}
          width={PAGE_WIDTH}
          height={PAGE_HEIGHT}
          size="stretch"
          minWidth={PAGE_MIN_WIDTH}
          maxWidth={PAGE_MAX_WIDTH}
          minHeight={420}
          maxHeight={760}
          showCover
          mobileScrollSupport
          drawShadow
          flippingTime={700}
          // 데스크톱은 부모 폭이 넓어 landscape(양면)로 동작하고,
          // 모바일 등 좁은 폭에서는 usePortrait로 단면 폴백을 유지한다.
          usePortrait
          maxShadowOpacity={0.5}
          className="catalog-flipbook"
        >
          {slots.map((src, index) => (
            <Page
              key={src ? `${index}-${src.slice(0, 32)}` : `blank-${index}`}
              src={src}
              pageNumber={index + 1}
              total={slots.length}
            />
          ))}
        </FlipBook>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
          className="inline-flex items-center justify-center rounded-md border border-border-light bg-surface-white px-4 py-2 min-h-[44px] text-sm font-medium text-heading-dark hover:bg-surface-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2"
        >
          이전
        </button>
        <button
          type="button"
          onClick={() => bookRef.current?.pageFlip()?.flipNext()}
          className="inline-flex items-center justify-center rounded-md border border-border-light bg-surface-white px-4 py-2 min-h-[44px] text-sm font-medium text-heading-dark hover:bg-surface-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2"
        >
          다음
        </button>
      </div>
    </div>
  )
}
