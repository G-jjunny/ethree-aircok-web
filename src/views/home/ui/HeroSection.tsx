import Link from 'next/link';
import { SITE } from '@/shared/config';

export function HeroSection() {
  return (
    <section className="bg-surface-dark">
      <div className="max-w-[1200px] mx-auto px-5 py-9">
        <div className="flex flex-col items-start gap-8">
          <h1 className="text-heading-light font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight max-w-3xl">
            {SITE.tagline}
          </h1>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/contact"
              className="bg-aircok-blue text-heading-light rounded-md px-5 py-2.5 font-medium hover:bg-aircok-blue-dark transition-colors text-center"
            >
              {SITE.hero.cta.primary}
            </Link>
            <Link
              href="/services"
              className="border border-heading-light text-heading-light rounded-pill px-5 py-2.5 hover:bg-overlay-white-10 transition-colors text-center"
            >
              {SITE.hero.cta.secondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
