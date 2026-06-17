import Link from 'next/link';
import { SITE } from '@/shared/config';

export function GlobalCta() {
  return (
    <section className="bg-aircok-blue">
      <div className="max-w-[1200px] mx-auto px-5 py-20 flex flex-col items-center gap-8 text-center">
        <h2 className="text-heading-light text-3xl font-display font-semibold text-center leading-[1.10] tracking-[-0.3px] [word-break:keep-all]">
          {SITE.bottomCta.heading}
        </h2>
        <p className="text-heading-light opacity-80 text-[17px] leading-[1.65] [word-break:keep-all] max-w-[640px]">
          {SITE.bottomCta.body}
        </p>
        <Link
          href={SITE.bottomCta.ctaHref}
          className="bg-surface-white text-aircok-blue rounded-md px-8 py-3 font-medium hover:bg-surface-light active:scale-[0.97] transition-colors min-h-[44px] inline-flex items-center justify-center"
        >
          {SITE.bottomCta.cta}
        </Link>
        <a
          href={`tel:${SITE.contact.phone}`}
          className="text-heading-light opacity-80 text-sm hover:opacity-100 transition-opacity"
        >
          {SITE.bottomCta.phoneLabel}{SITE.contact.phone}
        </a>
      </div>
    </section>
  );
}
