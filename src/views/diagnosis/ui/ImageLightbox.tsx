'use client'

import { useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
function resolveSrc(src: string): string {
  return src.startsWith('http') ? src : `${API_BASE}${src}`
}

type ImageLightboxProps = {
  src: string
  alt: string
}

export function ImageLightbox({ src, alt }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolveSrc(src)}
        alt={alt}
        className="w-full h-auto object-contain cursor-zoom-in"
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <div
          className="fixed inset-0 bg-overlay-dark z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          {/* max-w-[90vw] max-h-[90vh]: 뷰포트 기준 모달 크기 제한, 토큰 없음 */}
          <div
            className="relative max-w-[90vw] max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-heading-light text-3xl leading-none z-10"
              onClick={() => setIsOpen(false)}
              aria-label="닫기"
            >
              &times;
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolveSrc(src)}
              alt={alt}
              className="w-auto h-auto object-contain max-w-[90vw] max-h-[90vh]"
            />
          </div>
        </div>
      )}
    </div>
  )
}
