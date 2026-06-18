import { SITE } from '@/shared/config'
import { SubHeroSection } from './SubHeroSection'
import { DiagnosisImageSection } from './DiagnosisImageSection'
import { DiagnosisFormSection } from './DiagnosisFormSection'

export function DiagnosisView() {
  return (
    <main>
      <SubHeroSection
        label={SITE.diagnosis.hero.label}
        title={SITE.pages.diagnosis.title}
        description={SITE.pages.diagnosis.description}
      />
      <DiagnosisImageSection />
      <DiagnosisFormSection />
    </main>
  )
}
