'use client'

import { ProductSectionImageManager } from '@/widgets/product-section-image-manager'
import type { ProductSectionImageSlotConfig } from '@/widgets/product-section-image-manager'

/** 클라우드 모니터링 섹션의 고정 슬롯. 배열 순서 = 화면 렌더 순서. */
const MONITORING_SLOTS: readonly ProductSectionImageSlotConfig[] = [
  {
    slot: 'MONITORING_DASHBOARD',
    label: '대시보드',
    description: '실시간 공기질 대시보드 화면',
  },
  {
    slot: 'MONITORING_STATS',
    label: '통계',
    description: '기간별 통계·리포트 화면',
  },
  {
    slot: 'MONITORING_DEVICES',
    label: '기기',
    description: '기기 목록·상태 관리 화면',
  },
  {
    slot: 'MONITORING_DID',
    label: 'DID',
    description: '전광판(DID) 노출 화면',
  },
]

/**
 * 실내 공기질 관리 시스템 이미지 관리 패널.
 * 슬롯 고정 모델이라 순서 개념이 없다 — 섹션별 슬롯 구성만 위젯에 주입한다.
 *
 * 통합 콘솔 `/console/indoor`의 "이미지" 탭 콘텐츠.
 * product-section-image-manager 위젯을 조합하는 view 레이어 로컬 패널이다.
 */
export function IndoorImagesPanel() {
  return (
    <div className="flex flex-col gap-6">
      <ProductSectionImageManager
        title="클라우드 모니터링 이미지"
        description="모니터링 섹션의 화면 예시 이미지입니다."
        slots={MONITORING_SLOTS}
      />
    </div>
  )
}
