'use client'

import { ProductSectionImageManager } from '@/widgets/product-section-image-manager'
import type { ProductSectionImageSlotConfig } from '@/widgets/product-section-image-manager'

/** 히어로 섹션의 고정 슬롯. */
const HERO_SLOTS: readonly ProductSectionImageSlotConfig[] = [
  {
    slot: 'DIAGNOSIS_HERO',
    label: '히어로 이미지',
    description: '진단서비스 페이지 최상단 우측 이미지 카드',
  },
]

/** 에어콕 구성 섹션의 고정 슬롯. 배열 순서 = 화면 렌더 순서. */
const COMPOSE_SLOTS: readonly ProductSectionImageSlotConfig[] = [
  {
    slot: 'DIAGNOSIS_COMPOSE_DEVICE',
    label: '실내공기질 측정기',
    description: '에어콕 구성 섹션 — 측정기 이미지',
  },
  {
    slot: 'DIAGNOSIS_COMPOSE_MONITOR',
    label: '공기오염 모니터링 서비스',
    description: '에어콕 구성 섹션 — 모니터링 서비스 이미지',
  },
]

/** 도입 전후 비교 섹션의 고정 슬롯. 배열 순서 = 화면 렌더 순서. */
const COMPARE_SLOTS: readonly ProductSectionImageSlotConfig[] = [
  {
    slot: 'DIAGNOSIS_COMPARE_BEFORE',
    label: '도입 전',
    description: '전후 비교 섹션 — 도입 전 이미지',
  },
  {
    slot: 'DIAGNOSIS_COMPARE_AFTER',
    label: '도입 후',
    description: '전후 비교 섹션 — 도입 후 이미지',
  },
]

/**
 * 진단서비스 히어로·구성·비교 이미지 관리 패널.
 * 슬롯 고정 모델이라 순서 개념이 없다 — 섹션별 슬롯 구성만 위젯에 주입한다.
 *
 * 통합 콘솔 `/console/diagnosis`의 "구성·비교 이미지" 탭 콘텐츠.
 * product-section-image-manager 위젯을 조합하는 view 레이어 로컬 패널이다
 * (widget→widget import를 피하기 위해 뷰 슬라이스 내부에 둔다).
 */
export function DiagnosisSectionImagesPanel() {
  return (
    <div className="flex flex-col gap-6">
      <ProductSectionImageManager
        title="히어로 이미지"
        description="진단서비스 페이지 최상단 히어로 섹션에 노출되는 이미지입니다."
        slots={HERO_SLOTS}
      />
      <ProductSectionImageManager
        title="에어콕 구성 이미지"
        description="진단서비스 구성 섹션에 노출되는 이미지입니다."
        slots={COMPOSE_SLOTS}
      />
      <ProductSectionImageManager
        title="도입 전후 비교 이미지"
        description="진단서비스 전후 비교 섹션에 노출되는 이미지입니다."
        slots={COMPARE_SLOTS}
      />
    </div>
  )
}
