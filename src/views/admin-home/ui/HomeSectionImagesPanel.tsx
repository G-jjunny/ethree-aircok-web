'use client'

import { ProductSectionImageManager } from '@/widgets/product-section-image-manager'
import type { ProductSectionImageSlotConfig } from '@/widgets/product-section-image-manager'

/** 홈 Our Value 섹션의 고정 슬롯. 배열 순서 = 홈 화면 카드 순서(1:1 고정 매핑). */
const VALUE_SLOTS: readonly ProductSectionImageSlotConfig[] = [
  {
    slot: 'HOME_VALUE_1',
    label: '카드 01 · 정확성',
    description: '국가 공인 1등급의 정확한 광산란 측정',
  },
  {
    slot: 'HOME_VALUE_2',
    label: '카드 02 · 다양성',
    description: '실내 8·실외 12항목 국내 최대 측정 범위',
  },
  {
    slot: 'HOME_VALUE_3',
    label: '카드 03 · 편리성',
    description: '수기 일지를 자동 REPORT로 간편하게',
  },
  {
    slot: 'HOME_VALUE_4',
    label: '카드 04 · 연계성',
    description: 'Our Value 네 번째 카드 이미지',
  },
]

/** 홈 FREE REPORT 섹션의 고정 슬롯. */
const REPORT_SLOTS: readonly ProductSectionImageSlotConfig[] = [
  {
    slot: 'HOME_REPORT_ILLUST',
    label: 'FREE REPORT 일러스트',
    description: '홈 무료 리포트 섹션 우측 일러스트',
  },
]

/**
 * 홈 페이지 섹션 이미지 관리 패널.
 * 슬롯 고정 모델이라 순서 개념이 없다 — 섹션별 슬롯 구성만 위젯에 주입한다.
 *
 * product-section-image-manager 위젯을 조합하는 view 레이어 로컬 패널이다
 * (widget→widget import를 피하기 위해 뷰 슬라이스 내부에 둔다).
 */
export function HomeSectionImagesPanel() {
  return (
    <div className="flex flex-col gap-6">
      <ProductSectionImageManager
        title="Our Value 카드 이미지"
        description="홈 Our Value 섹션의 카드 4장에 노출되는 이미지입니다. 카드 순서와 1:1로 대응합니다."
        slots={VALUE_SLOTS}
      />
      <ProductSectionImageManager
        title="FREE REPORT 일러스트"
        description="홈 무료 리포트 섹션 우측에 노출되는 일러스트입니다."
        slots={REPORT_SLOTS}
      />
    </div>
  )
}
