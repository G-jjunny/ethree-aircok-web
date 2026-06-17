import Link from 'next/link';
import { SITE } from '@/shared/config';

export function CtaSection() {
  return (
    <section className="bg-aircok-blue">
      <div className="max-w-[1200px] mx-auto px-5 py-9 flex flex-col items-center gap-6">
        <h2 className="text-heading-light font-display text-3xl md:text-4xl font-semibold text-center">
          {SITE.cta.headline}
        </h2>
        <Link
          href="/contact"
          className="bg-surface-white text-aircok-blue rounded-md px-8 py-3 font-medium hover:bg-surface-light transition-colors"
        >
          {SITE.cta.button}
        </Link>
      </div>
    </section>
  );
}
