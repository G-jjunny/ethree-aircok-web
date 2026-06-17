import { HeroSection } from './HeroSection';
import { StatSection } from './StatSection';
import { WhatYouGetSection } from './WhatYouGetSection';
import { MethodologySection } from './MethodologySection';
import { WhyChooseUsSection } from './WhyChooseUsSection';
import { WhyChooseUsFeatureSection } from './WhyChooseUsFeatureSection';
import { PartnersSection } from './PartnersSection';
import { BottomCTASection } from './BottomCTASection';

export function HomeView() {
  return (
    <main>
      <HeroSection />
      <StatSection />
      <WhatYouGetSection />
      <MethodologySection />
      <WhyChooseUsSection />
      <WhyChooseUsFeatureSection />
      <PartnersSection />
      <BottomCTASection />
    </main>
  );
}
