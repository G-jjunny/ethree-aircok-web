import Link from 'next/link';

import { SITE } from '@/shared/config';

export function HeroSection() {
  return (
    // bg-surface-stat: 바로 아래 StatSection과 동일 딥 네이비를 공유해 하나의 연속 캔버스로 읽히게 함
    // Centered Statement: 제품 비주얼 없이 타이포·여백·CTA만으로 첫인상을 만든다 ("여백이 곧 공기")
    <section className="bg-surface-stat min-h-[calc(100vh-52px)]">
      {/* min-h-[calc(100vh-52px)]: Nav 높이 52px 제외 — 1회성 레이아웃 수치 */}
      <div className="content-container flex min-h-[calc(100vh-52px)] items-center">
        <div className="mx-auto flex max-w-3xl flex-col items-center py-20 text-center">
          {/* Signature: Air Spine — 브랜드 수직 룰 + 영문 워드마크 eyebrow (중앙 정렬) */}
          <div className="flex items-center justify-center gap-3">
            <span aria-hidden="true" className="block h-6 w-0.5 bg-aircok-blue" />
            <span className="text-aircok-blue-light text-sm font-medium tracking-[0.2em]">
              {SITE.nameEn}
            </span>
          </div>

          <h1 className="mt-8 font-display text-4xl font-semibold leading-[1.07] tracking-tight text-heading-light [word-break:keep-all] sm:text-5xl md:text-6xl lg:text-7xl">
            {SITE.tagline}
          </h1>

          <p className="mt-6 max-w-xl text-subheading leading-[1.65] text-body-light [word-break:keep-all]">
            {SITE.hero.subtitle}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-aircok-blue px-5 font-medium text-heading-light transition-colors hover:bg-aircok-blue-dark active:scale-[0.97]"
            >
              {SITE.hero.cta.primary}
            </Link>
            <Link
              href="/services"
              className="inline-flex min-h-[44px] items-center justify-center rounded-pill border border-heading-light px-5 text-heading-light transition-colors hover:bg-overlay-white-10"
            >
              {SITE.hero.cta.secondary}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
