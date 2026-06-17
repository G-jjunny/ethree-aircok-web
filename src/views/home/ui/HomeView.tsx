import { HeroSection } from './HeroSection';
import { StatSection } from './StatSection';
import { MethodologySection } from './MethodologySection';
import { WhatYouGetSection } from './WhatYouGetSection';
import { WhyChooseUsSection } from './WhyChooseUsSection';
import { WhyChooseUsFeatureSection } from './WhyChooseUsFeatureSection';
import { PartnersSection } from './PartnersSection';
export function HomeView() {
  return (
    <main>
      <HeroSection />
      <StatSection />
      <MethodologySection />
      <WhatYouGetSection />
      <WhyChooseUsSection />
      <WhyChooseUsFeatureSection />
      <PartnersSection />
    </main>
  );
}
