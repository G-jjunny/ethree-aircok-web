import { Suspense } from 'react'
import { PageHeroSection } from './PageHeroSection'
import { MissionSection } from './MissionSection'
import { StatsSection } from './StatsSection'
import { TeamSection } from './TeamSection'
import { PartnersSection } from './PartnersSection'
import { HistorySection } from './HistorySection'

/**
 * About 페이지 조합 (시안 재디자인). 섹션 순서:
 * HERO → MISSION → BY THE NUMBERS → OUR TEAM → OUR PARTNERS → HISTORY.
 * CTA/Footer 는 (main) layout 에 전역 배치되어 있어 여기서 중복 추가하지 않는다.
 * 데이터 페칭 섹션(Team/Partners/History)만 Suspense 경계로 감싼다.
 */
export function AboutView() {
  return (
    <main>
      <PageHeroSection />
      <MissionSection />
      <StatsSection />
      {/* token 없음: min-h-[600px]/[500px] — 데이터 섹션 로딩 스켈레톤 최소 높이(CLS 방지용 1회성 근사치) */}
      <Suspense fallback={<div className="min-h-[600px] bg-surface-white" />}>
        <TeamSection />
      </Suspense>
      <Suspense fallback={<div className="min-h-[500px] bg-surface" />}>
        <PartnersSection />
      </Suspense>
      <Suspense fallback={<div className="min-h-[500px] bg-surface" />}>
        <HistorySection />
      </Suspense>
    </main>
  )
}
