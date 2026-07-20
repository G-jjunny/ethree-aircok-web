import { Suspense } from 'react'
import { ServiceHeroSection } from './ServiceHeroSection'
import { ServiceFlowSection } from './ServiceFlowSection'
import { ServiceTargetsSection } from './ServiceTargetsSection'
import { ServiceTrustSection } from './ServiceTrustSection'
import { ServiceHistorySection } from './ServiceHistorySection'
import { ServiceReviewsSection } from './ServiceReviewsSection'
import { ServiceCompareSection } from './ServiceCompareSection'
import { ServiceCertsSection } from './ServiceCertsSection'
import { ServiceComposeSection } from './ServiceComposeSection'
import { ServiceApplySection } from './ServiceApplySection'
import { DiagnosisFormSection } from './DiagnosisFormSection'

/**
 * 진단서비스 신청 페이지(2단계 공개 페이지) 조합.
 *
 * 정적 섹션(Hero/Flow/Targets/Trust/Apply)은 셸에 프리렌더되고,
 * 데이터 섹션(History/Reviews/Compare/Certs/Compose)은 각 서버 컴포넌트가 await connection()으로
 * 요청 시점까지 페칭을 미뤄 Suspense 경계로 스트리밍된다(PPR 유지).
 * 마크업은 각 섹션 컴포넌트에 있고, 이 View 는 조합만 한다.
 */
export function DiagnosisView() {
  return (
    <main>
      <ServiceHeroSection />
      <ServiceFlowSection />
      <ServiceTargetsSection />

      <ServiceTrustSection>
        <Suspense fallback={<div className="mt-18 min-h-[320px]" />}>
          <ServiceHistorySection />
        </Suspense>
      </ServiceTrustSection>

      <Suspense fallback={<div className="min-h-[600px] bg-surface" />}>
        <ServiceReviewsSection />
      </Suspense>

      <Suspense fallback={<div className="min-h-[600px] bg-navy" />}>
        <ServiceCompareSection />
      </Suspense>

      <Suspense fallback={<div className="min-h-[600px] bg-surface-white" />}>
        <ServiceCertsSection />
      </Suspense>

      <Suspense fallback={<div className="min-h-[600px] bg-surface" />}>
        <ServiceComposeSection />
      </Suspense>

      <ServiceApplySection />
      <DiagnosisFormSection />
    </main>
  )
}
