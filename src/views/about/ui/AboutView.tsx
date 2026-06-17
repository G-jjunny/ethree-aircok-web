import { PageHeroSection } from './PageHeroSection'
import { IntroSection } from './IntroSection'
import { TeamSection } from './TeamSection'
import { PartnersSection } from './PartnersSection'
import { HistorySection } from './HistorySection'

export function AboutView() {
  return (
    <main>
      <PageHeroSection />
      <IntroSection />
      <TeamSection />
      <PartnersSection />
      <HistorySection />
    </main>
  )
}
