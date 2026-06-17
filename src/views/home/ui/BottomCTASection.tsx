import Link from 'next/link';
import { SITE } from '@/shared/config';

export function BottomCTASection() {
  return (
    <section className="bg-surface-light border-t border-border-light">
      <div className="max-w-[1200px] mx-auto px-5 py-20 flex flex-col items-center gap-8 text-center">
        <h2 className="text-[40px] font-semibold font-display text-heading-dark leading-[1.10] tracking-[-0.3px] [word-break:keep-all]">
          {SITE.bottomCta.heading}
        </h2>

        <p className="text-[17px] text-body-dark leading-[1.65] [word-break:keep-all] max-w-[640px]">
          {SITE.bottomCta.body}
        </p>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Link
            href={SITE.bottomCta.ctaHref}
            className="inline-flex items-center justify-center bg-aircok-blue text-heading-light text-[17px] font-medium rounded-md px-5 py-[10px] min-h-[44px] hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors"
          >
            {SITE.bottomCta.cta}
          </Link>

          <span className="text-[17px] text-secondary-dark select-none" aria-hidden="true">
            or
          </span>

          <a
            href={`tel:${SITE.contact.phone}`}
            className="text-[17px] font-medium text-aircok-blue hover:underline"
          >
            {SITE.bottomCta.phoneLabel}{SITE.contact.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
