'use client'

import { useState } from 'react'
import type { ServiceImage } from '@/entities/service-image'

/** 이미지 항목은 백엔드 절대 URL로 보정한다(catalog/news 패턴). */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
function resolveSrc(src: string): string {
  return src.startsWith('http') ? src : `${API_BASE}${src}`
}

/**
 * 서비스(제품군) 소개 이미지 갤러리 leaf.
 * 서버에서 조회한 이미지를 props로 받아 세로로 나열하고, 클릭 시 라이트박스로 확대한다.
 * zoomedSrc 상태만 소유하는 얇은 클라이언트 컴포넌트.
 */
export function ServiceImageGallery({ images }: { images: ServiceImage[] }) {
  const [zoomedSrc, setZoomedSrc] = useState<string | null>(null)

  return (
    <>
      <div className="flex flex-col gap-0">
        {images.map((image, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={image.id}
            src={resolveSrc(image.imageUrl)}
            alt={`서비스 소개 이미지 ${index + 1}`}
            className="w-full h-auto object-contain cursor-zoom-in"
            onClick={() => setZoomedSrc(resolveSrc(image.imageUrl))}
          />
        ))}
      </div>

      {zoomedSrc && (
        <div
          className="fixed inset-0 bg-overlay-dark z-50 flex items-center justify-center p-4"
          onClick={() => setZoomedSrc(null)}
        >
          {/* max-w-[90vw] max-h-[90vh]: 뷰포트 기준 모달 크기 제한, 토큰 없음 */}
          <div
            className="relative max-w-[90vw] max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-2 right-2 text-heading-light text-3xl leading-none z-10"
              onClick={() => setZoomedSrc(null)}
              aria-label="닫기"
            >
              &times;
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={zoomedSrc}
              alt="서비스 소개 이미지 확대"
              className="w-auto h-auto object-contain max-w-[90vw] max-h-[90vh]"
            />
          </div>
        </div>
      )}
    </>
  )
}
