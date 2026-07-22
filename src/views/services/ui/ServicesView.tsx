import { SITE } from '@/shared/config'
import { PageHero } from '@/widgets/page-hero'
import { IndoorPanel } from './IndoorPanel'
import { KitchenPanel } from './KitchenPanel'
import { ServicesTabs } from './ServicesTabs'

/**
 * `/services` 제품군 페이지 — 조합 전용(마크업·데이터 로직 없음).
 *
 * 히어로는 Blue-Tech 표준 위젯 `PageHero` 를 재사용하고(카피만 props 주입),
 * 본문은 2탭 셸(ServicesTabs, 클라이언트)에 서버 패널 트리를 prop 으로 넘겨 조합한다.
 * 각 섹션의 데이터 페칭과 Suspense 경계는 패널이 담당한다.
 */
export function ServicesView() {
  const { hero } = SITE.pages.services

  return (
    <main>
      <PageHero
        eyebrow={hero.label}
        headline={{ prefix: hero.headline }}
        body={hero.body}
      />
      <ServicesTabs indoor={<IndoorPanel />} kitchen={<KitchenPanel />} />
    </main>
  )
}
