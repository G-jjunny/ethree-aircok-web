import { Suspense } from 'react'
import { KitchenBrandSection } from './KitchenBrandSection'
import { KitchenDiagnosisSection } from './KitchenDiagnosisSection'
import { KitchenFlowSection } from './KitchenFlowSection'

/**
 * [탭 2] 주방 조리실 공기질 개선(AIR CHEF) 패널 — 서버 컴포넌트 조합.
 *
 * IndoorPanel 과 동일 규칙: 데이터 의존 섹션만 `<Suspense>` 로 감싸고 정적 섹션은 셸에 남긴다.
 * (KitchenBlackbox·KitchenAirshield 섹션은 이번 범위에서 제외.)
 */
export function KitchenPanel() {
  return (
    <>
      <Suspense fallback={<div className="min-h-100 bg-chef-dark" />}>
        <KitchenBrandSection />
      </Suspense>

      <KitchenFlowSection />

      <Suspense fallback={<div className="min-h-150 bg-surface" />}>
        <KitchenDiagnosisSection />
      </Suspense>
    </>
  )
}
