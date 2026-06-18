import { SITE } from '@/shared/config'
import { SubHeroSection } from './SubHeroSection'
import { DiagnosisFormSection } from './DiagnosisFormSection'
import { ImageLightbox } from './ImageLightbox'

export function FreeTest1View() {
  return (
    <main>
      <SubHeroSection
        label={SITE.diagnosis.hero.freeTest1.label}
        title={SITE.diagnosis.hero.freeTest1.title}
        description={SITE.pages.diagnosisFreeTest1.description}
      />
      <ImageLightbox
        src="/images/diagnosis/free-test-1.png"
        alt="무료 테스트1 — 스마트에어콕 무료 테스트 신청 안내"
      />
      <DiagnosisFormSection />
    </main>
  )
}
