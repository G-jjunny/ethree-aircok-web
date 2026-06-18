'use client'

import Image from 'next/image'
import { useState } from 'react'

type ImageLightboxProps = {
  src: string
  alt: string
}

export function ImageLightbox({ src, alt }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section className="bg-surface-white py-20">
      <div className="content-container">
        {/* max-w-[780px]: 인포그래픽 최적 가독 너비, 토큰 없음 */}
        <div className="max-w-[780px] mx-auto">
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={1800}
            className="w-full h-auto object-contain cursor-zoom-in"
            sizes="(max-width: 780px) 100vw, 780px"
            onClick={() => setIsOpen(true)}
          />
        </div>
      </div>

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
            <Image
              src={src}
              alt={alt}
              width={1200}
              height={1800}
              className="w-auto h-auto object-contain"
              sizes="90vw"
            />
          </div>
        </div>
      )}
    </section>
  )
}
