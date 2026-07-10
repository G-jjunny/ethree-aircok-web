import { HeroSection } from './HeroSection';
import { CertSection } from './CertSection';
import { WhyMattersSection } from './WhyMattersSection';
import { AboutStepSection } from './AboutStepSection';
import { OurValueSection } from './OurValueSection';
import { PlatformSection } from './PlatformSection';
import { WordmarkSection } from './WordmarkSection';
import { ClientsSection } from './ClientsSection';

/**
 * 홈(랜딩) 뷰 — 시안 §2~§9 조합.
 * Header(§1)/하단 CTA(§10)/Footer(§11)는 app/(main)/layout.tsx 전역 위젯이 담당한다.
 */
export function HomeView() {
  return (
    <main>
      <HeroSection />
      <CertSection />
      <WhyMattersSection />
      <AboutStepSection />
      <OurValueSection />
      <PlatformSection />
      <WordmarkSection />
      <ClientsSection />
    </main>
  );
}
