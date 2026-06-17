import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { FeatureSection } from './FeatureSection';
import { PartnersSection } from './PartnersSection';
import { CtaSection } from './CtaSection';

export function HomeView() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <FeatureSection />
      <PartnersSection />
      <CtaSection />
    </main>
  );
}
