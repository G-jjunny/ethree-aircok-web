'use client'

import { ProductSectionImageManager } from '@/widgets/product-section-image-manager'
import type { ProductSectionImageSlotConfig } from '@/widgets/product-section-image-manager'

/** 소개 페이지 섹션의 고정 슬롯. 배열 순서 = 화면 렌더 순서. */
const ABOUT_SECTION_SLOTS: readonly ProductSectionImageSlotConfig[] = [
  {
    slot: 'ABOUT_MISSION',
    label: 'Mission 이미지',
    description: '소개 페이지 Mission 섹션 우측 이미지',
  },
]

/**
 * 소개 페이지 섹션 이미지 관리 패널.
 * 슬롯 고정 모델이라 순서 개념이 없다 — 섹션별 슬롯 구성만 위젯에 주입한다.
 *
 * 통합 콘솔 `/console/about`의 "섹션 이미지" 탭 콘텐츠.
 * product-section-image-manager 위젯을 조합하는 view 레이어 로컬 패널이다
 * (widget→widget import를 피하기 위해 뷰 슬라이스 내부에 둔다).
 */
export function AboutSectionImagesPanel() {
  return (
    <div className="flex flex-col gap-6">
      <ProductSectionImageManager
        title="소개 페이지 섹션 이미지"
        description="소개(About) 페이지 고정 자리에 노출되는 이미지입니다."
        slots={ABOUT_SECTION_SLOTS}
      />
    </div>
  )
}
