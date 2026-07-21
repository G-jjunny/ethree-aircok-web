import { connection } from 'next/server'
import { getProductSectionImageListServer } from '@/entities/product-section-image/server'
import {
  getSlotImage,
  type ProductSectionImage,
} from '@/entities/product-section-image'
import { SlotImage } from './SlotImage'

/** 이미지/폴백 공통 레이아웃 — 등록 전후 레이아웃 동일(CLS 방지). */
const IMAGE_PROPS = {
  alt: '진단 서비스 대표 이미지',
  label: 'DIAGNOSIS',
  variant: 'dark',
  rounded: 'rounded-card-lg',
  /* token 없음: aspect-[4/3] 히어로 이미지 카드 비율(시안 실측 1회성) */
  className: 'aspect-[4/3] w-full shadow-float',
  sizes: '(min-width: 1024px) 560px, 100vw',
} as const

/** 히어로 이미지 폴백(슬롯 미등록/스트리밍 대기) — 다크 톤 플레이스홀더. */
export function ServiceHeroImageFallback() {
  return <SlotImage src={null} {...IMAGE_PROPS} />
}

/**
 * 진단 히어로 우측 이미지 — **async 서버 컴포넌트**(데이터).
 *
 * 히어로 전체를 async 로 만들면 above-the-fold 셸이 스트리밍으로 밀리므로,
 * 이미지 자리만 분리해 Suspense 경계에서 스트리밍한다(라우트 프리렌더 유지).
 * 슬롯(DIAGNOSIS_HERO) 미등록은 정상 케이스이며 폴백을 렌더한다.
 */
export async function ServiceHeroImage() {
  await connection()

  let images: ProductSectionImage[] = []
  try {
    images = await getProductSectionImageListServer()
  } catch {
    images = []
  }

  return (
    <SlotImage
      src={getSlotImage(images, 'DIAGNOSIS_HERO')}
      priority
      {...IMAGE_PROPS}
    />
  )
}
