import { SITE } from '@/shared/config'
import { SubHeroSection } from './SubHeroSection'
import { DiagnosisFormSection } from './DiagnosisFormSection'
import { ImageLightbox } from './ImageLightbox'

export function FreeTest2View() {
  return (
    <main>
      <SubHeroSection
        label={SITE.diagnosis.hero.freeTest2.label}
        title={SITE.diagnosis.hero.freeTest2.title}
        description={SITE.pages.diagnosisFreeTest2.description}
      />
      <ImageLightbox
        src="/images/diagnosis/free-test-2.png"
        alt="무료 테스트2 — 스마트에어콕 무료 테스트2 신청 안내"
      />
      <DiagnosisFormSection />
    </main>
  )
}
