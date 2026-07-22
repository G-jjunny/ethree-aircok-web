'use client'

import { ProductSectionImageManager } from '@/widgets/product-section-image-manager'
import type { ProductSectionImageSlotConfig } from '@/widgets/product-section-image-manager'
import { SITE } from '@/shared/config'

/**
 * 홈 Our Value 카드 슬롯 ID. 배열 순서 = 홈 화면 카드 순서 = `SITE.whyUs.features` 순서
 * (WhyChooseUsSection 의 VALUE_META 와 동일한 1:1 고정 매핑).
 */
const VALUE_SLOT_IDS = [
  'HOME_VALUE_1',
  'HOME_VALUE_2',
  'HOME_VALUE_3',
  'HOME_VALUE_4',
] as const satisfies readonly ProductSectionImageSlotConfig['slot'][]

/**
 * 라벨·설명 카피는 `SITE.whyUs.features` 를 SSOT 로 파생한다(하드코딩 복제 금지).
 * features 길이가 슬롯 수보다 짧아도 깨지지 않도록 존재하는 카드만 노출한다.
 */
const VALUE_SLOTS: readonly ProductSectionImageSlotConfig[] = VALUE_SLOT_IDS.flatMap(
  (slot, i) => {
    const feature = SITE.whyUs.features.at(i)
    if (!feature) return []
    return [
      {
        slot,
        label: `카드 0${i + 1} · ${feature.title}`,
        description: feature.cardTitle,
      },
    ]
  },
)

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
