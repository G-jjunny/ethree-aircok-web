'use client'

import { AdminPageHeader } from '@/shared/ui'
import { ProductSectionImageManager } from '@/widgets/product-section-image-manager'
import type { ProductSectionImageSlotConfig } from '@/widgets/product-section-image-manager'

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
 * 진단서비스 구성·비교 이미지 관리 뷰.
 * 슬롯 고정 모델이라 순서 개념이 없다 — 섹션별 슬롯 구성만 위젯에 주입한다.
 */
export function AdminDiagnosisSectionImagesView() {
  return (
    <div>
      <AdminPageHeader
        title="진단 구성·비교 이미지 관리"
        description="진단서비스 페이지의 에어콕 구성 이미지와 도입 전후 비교 이미지를 등록·교체·삭제합니다."
      />
      <div className="p-6 lg:p-8 flex flex-col gap-6">
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
    </div>
  )
}
