import { Suspense } from 'react'
import { KitchenAirshieldSection } from './KitchenAirshieldSection'
import { KitchenBlackboxSection } from './KitchenBlackboxSection'
import { KitchenBrandSection } from './KitchenBrandSection'
import { KitchenDiagnosisSection } from './KitchenDiagnosisSection'
import { KitchenFlowSection } from './KitchenFlowSection'

/**
 * [탭 2] 주방 조리실 공기질 개선(AIR CHEF) 패널 — 서버 컴포넌트 조합.
 *
 * IndoorPanel 과 동일 규칙: 데이터 의존 섹션(진단 / 블랙박스 / 에어쉴드)만 `<Suspense>` 로 감싸고
 * 정적 섹션(브랜드 / 프로세스)은 셸에 남긴다.
 * 섹션 순서는 시안(products-v2) 기준: 브랜드 → 프로세스 → 진단 → 블랙박스 → 에어쉴드.
 * Suspense fallback 의 배경 톤은 각 섹션 배경과 맞춰 스트리밍 중 플래시를 막는다
 * (Blackbox=surface-white · Airshield=chef-dark).
 */
export function KitchenPanel() {
  return (
    <>
      <KitchenBrandSection />

      <KitchenFlowSection />

      <Suspense fallback={<div className="min-h-150 bg-surface" />}>
        <KitchenDiagnosisSection />
      </Suspense>

      <Suspense fallback={<div className="min-h-150 bg-surface-white" />}>
        <KitchenBlackboxSection />
      </Suspense>

      <Suspense fallback={<div className="min-h-200 bg-chef-dark" />}>
        <KitchenAirshieldSection />
      </Suspense>
    </>
  )
}
