'use client'

import { forwardRef, useRef } from 'react'
import type { ComponentType, CSSProperties, ReactNode } from 'react'
import HTMLFlipBookDefault from 'react-pageflip'
import type { CatalogImage } from '@/entities/catalog'

/**
 * 상대 경로 이미지 URL을 백엔드 절대 URL로 보정한다.
 * (shared/ui NewsImage와 동일 패턴 — 동적 호스트라 next/image 대신 <img> 사용)
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
function resolveSrc(src: string): string {
  return src.startsWith('http') ? src : `${API_BASE}${src}`
}

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
 * HTMLFlipBook 자식은 ref를 받을 수 있는 컴포넌트여야 하므로 forwardRef로 정의한다.
 */
const Page = forwardRef<
  HTMLDivElement,
  { image: CatalogImage; pageNumber: number; total: number }
>(function Page({ image, pageNumber, total }, ref) {
  return (
    <div
      ref={ref}
      className="bg-surface-white flex items-center justify-center overflow-hidden"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolveSrc(image.imageUrl)}
        alt={`카탈로그 ${pageNumber}/${total} 페이지`}
        className="w-full h-full object-contain"
      />
    </div>
  )
})

interface FlipBookViewerProps {
  images: CatalogImage[]
}

export function FlipBookViewer({ images }: FlipBookViewerProps) {
  // HTMLFlipBook 인스턴스 ref — 외부 페이지 이동 버튼에서 사용
  const bookRef = useRef<{
    pageFlip: () => { flipNext: () => void; flipPrev: () => void }
  } | null>(null)

  return (
    <div className="flex flex-col items-center gap-6">
      <FlipBook
        ref={bookRef}
        width={480}
        height={640}
        size="stretch"
        minWidth={280}
        maxWidth={640}
        minHeight={360}
        maxHeight={900}
        showCover
        mobileScrollSupport
        drawShadow
        flippingTime={700}
        usePortrait
        maxShadowOpacity={0.5}
        className="catalog-flipbook"
      >
        {images.map((image, index) => (
          <Page
            key={image.id}
            image={image}
            pageNumber={index + 1}
            total={images.length}
          />
        ))}
      </FlipBook>

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
