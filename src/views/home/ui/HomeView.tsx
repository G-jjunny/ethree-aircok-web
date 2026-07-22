import { Suspense } from 'react';
import { HeroSection } from './HeroSection';
import { CertifiedSection } from './CertifiedSection';
import { WhySmartAircokSection } from './WhySmartAircokSection';
import { AboutAircokSection } from './AboutAircokSection';
import { WhyChooseUsSection } from './WhyChooseUsSection';
import { WhatYouGetSection } from './WhatYouGetSection';
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
      <CertifiedSection />
      <WhySmartAircokSection />
      <AboutAircokSection />
      <WhyChooseUsSection />
      <WhatYouGetSection />
      <WordmarkSection />
      <Suspense fallback={<div className="min-h-[500px] bg-surface" />}>
        <ClientsSection />
      </Suspense>
    </main>
  );
}
