'use client'

import { SITE } from '@/shared/config/site'
import { AdminPageHeader } from '@/shared/ui'
import { ProductSectionImageManager } from '@/widgets/product-section-image-manager'
import type { ProductSectionImageSlotConfig } from '@/widgets/product-section-image-manager'

/** 공기질 진단 서비스 섹션의 고정 슬롯. 배열 순서 = 화면 렌더 순서(진단 프로세스 순). */
const DIAGNOSIS_SLOTS: readonly ProductSectionImageSlotConfig[] = [
  {
    slot: 'DIAGNOSIS_VISIT',
    label: '방문',
    description: '현장 방문·측정기 설치 단계',
  },
  {
    slot: 'DIAGNOSIS_ANALYSIS',
    label: '분석',
    description: '수집 데이터 분석 단계',
  },
  {
    slot: 'DIAGNOSIS_REPORT',
    label: '리포트',
    description: '분석 레포트 제공 단계',
  },
  {
    slot: 'DIAGNOSIS_PROPOSAL',
    label: '제안',
    description: '개선 방향 제안 단계',
  },
]

/** 브랜드 배경 섹션의 고정 슬롯(주방 계열). */
const BRAND_SLOTS: readonly ProductSectionImageSlotConfig[] = [
  {
    slot: 'BRAND_BG_KITCHEN',
    label: `${SITE.airChef.name} 브랜드 배경`,
    description: '주방·조리실 브랜드 섹션의 배경 이미지',
  },
]

/** 안심 블랙박스(측정기) 섹션의 고정 슬롯. 배열 순서 = 화면 렌더 순서. */
const BLACKBOX_SLOTS: readonly ProductSectionImageSlotConfig[] = [
  {
    slot: 'KITCHEN_BLACKBOX_PRODUCT',
    label: '제품 사진',
    description: '블랙박스 측정기 제품 사진',
  },
  {
    slot: 'KITCHEN_BLACKBOX_DID',
    label: 'DID',
    description: '조리실 오염 현황 전광판(DID) 화면',
  },
]

/** 에어쉴드(환기청정시스템) 섹션의 고정 슬롯. */
const AIRSHIELD_SLOTS: readonly ProductSectionImageSlotConfig[] = [
  {
    slot: 'KITCHEN_AIRSHIELD_TECH',
    label: '특허 급기 기술',
    description: '에어쉴드 특허 급기 기술 설명 이미지',
  },
]

/**
 * 주방 조리실 관리 시스템 이미지 관리 뷰.
 * 슬롯 고정 모델이라 순서 개념이 없다 — 섹션별 슬롯 구성만 위젯에 주입한다.
 */
export function AdminKitchenImagesView() {
  return (
    <div>
      <AdminPageHeader
        title="주방 조리실 이미지 관리"
        description="주방 조리실 관리 시스템 섹션에 노출되는 고정 자리 이미지를 등록·교체·삭제합니다."
      />
      {/* 섹션 배치 순서는 `/services` 주방 탭의 실제 렌더 순서를 따른다. */}
      <div className="p-6 lg:p-8 flex flex-col gap-6">
        <ProductSectionImageManager
          title="브랜드 배경 이미지"
          description="브랜드 섹션의 배경으로 사용됩니다."
          slots={BRAND_SLOTS}
        />
        <ProductSectionImageManager
          title="공기질 진단 서비스 이미지"
          description="진단 서비스 프로세스 각 단계에 노출되는 이미지입니다."
          slots={DIAGNOSIS_SLOTS}
        />
        <ProductSectionImageManager
          title={`${SITE.airChef.name} 안심 블랙박스 이미지`}
          description="주방·조리실 공기질 측정기(블랙박스) 섹션에 노출되는 이미지입니다."
          slots={BLACKBOX_SLOTS}
        />
        <ProductSectionImageManager
          title={`${SITE.airChef.name} 에어쉴드 이미지`}
          description="주방·조리실 환기청정시스템(에어쉴드) 섹션에 노출되는 이미지입니다."
          slots={AIRSHIELD_SLOTS}
        />
      </div>
    </div>
  )
}
