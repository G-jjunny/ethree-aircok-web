'use client'

import { useState } from 'react'
import Image from 'next/image'
import { resolveSrc } from './SlotImage'

type CertGalleryItemProps = {
  src: string
  alt: string
}

/**
 * 인증서·특허증 갤러리 셀 — 클릭 시 모달 확대(클라이언트 leaf).
 *
 * 그리드 셀은 aspect-[3/4] 썸네일(next/image cover), 클릭하면 뷰포트 중앙 모달로 원본을 확대한다.
 * 모달 마크업은 ImageLightbox 패턴을 참고하되 갤러리 셀 형태에 맞췄다.
 * 인터랙션(모달 open/close) 상태 때문에 이 leaf 만 'use client' 경계를 갖는다.
 */
export function CertGalleryItem({ src, alt }: CertGalleryItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const resolved = resolveSrc(src)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative aspect-[3/4] w-full cursor-zoom-in overflow-hidden rounded-btn border border-hairline bg-surface-white"
        aria-label={`${alt} 확대`}
      >
        <Image
          src={resolved}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 200px, 33vw"
          className="object-cover"
        />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-overlay-dark p-4"
          onClick={() => setIsOpen(false)}
        >
          {/* max-w-[90vw] max-h-[90vh]: 뷰포트 기준 모달 크기 제한, 토큰 없음 */}
          <div
            className="relative max-h-[90vh] max-w-[90vw] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute right-2 top-2 z-10 text-3xl leading-none text-white"
              onClick={() => setIsOpen(false)}
              aria-label="닫기"
            >
              &times;
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolved}
              alt={alt}
              className="h-auto max-h-[90vh] w-auto max-w-[90vw] object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}
