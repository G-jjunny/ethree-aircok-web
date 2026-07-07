'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { ServiceImage } from '@/entities/service-image'

/** R2(http)는 그대로, 상대 경로(/uploads)는 동일 출처 rewrite 서빙되도록 상대 유지. */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
function resolveSrc(src: string): string {
  if (src.startsWith('http')) return src
  return src.startsWith('/') ? src : `${API_BASE}${src}`
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
          // 원본 비율을 알 수 없는 세로형 브로슈어 이미지 — next/image 반응형 패턴
          // (width/height=0 + sizes + h-auto)으로 lazy 최적화. 기본 lazy(priority 미지정).
          <Image
            key={image.id}
            src={resolveSrc(image.imageUrl)}
            alt={`서비스 소개 이미지 ${index + 1}`}
            width={0}
            height={0}
            sizes="(min-width: 780px) 780px, 100vw"
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
