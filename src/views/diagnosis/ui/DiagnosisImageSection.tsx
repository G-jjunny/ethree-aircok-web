'use client'

import { useQuery } from '@tanstack/react-query'
import { diagnosisImageListQueryOptions } from '@/entities/diagnosis-image'
import { ImageLightbox } from './ImageLightbox'

export function DiagnosisImageSection() {
  const { data: images = [] } = useQuery(diagnosisImageListQueryOptions())
  if (images.length === 0) return null
  return (
    <section className="bg-surface-white py-20">
      {/* token 없음: 780px는 세로형 슬라이드 가독성을 위한 1회성 콘텐츠 폭 제한 */}
      <div className="mx-auto w-full max-w-[780px] px-5">
        <div className="flex flex-col gap-0">
          {images.map((image, index) => (
            <ImageLightbox
              key={image.id}
              src={image.imageUrl}
              alt={`진단 서비스 안내 이미지 ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
