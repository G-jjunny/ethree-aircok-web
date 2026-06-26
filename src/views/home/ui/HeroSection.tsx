import Image from 'next/image';
import Link from 'next/link';

import { SITE } from '@/shared/config';

export function HeroSection() {
  return (
    // bg-surface-stat: 바로 아래 StatSection과 동일 딥 네이비를 공유해 하나의 연속 캔버스로 읽히게 함
    <section className="bg-surface-stat min-h-[calc(100vh-52px)]">
      {/* min-h-[calc(100vh-52px)]: Nav 높이 52px 제외 — 1회성 레이아웃 수치 */}
      <div className="content-container flex min-h-[calc(100vh-52px)] items-center">
        <div className="flex w-full flex-col items-center gap-16 py-20 lg:flex-row">
          {/* 좌측 콘텐츠 */}
          <div className="flex flex-col lg:w-1/2">
            {/* Signature: Air Spine — 브랜드 수직 룰 + 영문 워드마크 eyebrow */}
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="block h-6 w-0.5 bg-aircok-blue" />
              <span className="text-aircok-blue-light text-sm font-medium tracking-[0.2em]">
                {SITE.nameEn}
              </span>
            </div>

            <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.07] tracking-tight text-heading-light [word-break:keep-all] md:text-6xl lg:text-7xl">
              {SITE.tagline}
            </h1>

            <p className="mt-6 max-w-xl text-subheading leading-[1.65] text-body-light [word-break:keep-all]">
              {SITE.hero.subtitle}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
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

          {/* 우측 제품 비주얼 — 다크 캔버스 위에 헤일로 없이 제품을 그대로 배치 */}
          <div className="flex w-full items-center justify-center lg:w-1/2">
            <div className="relative aspect-square w-full">
              <Image
                src="/images/home/aircok_product.png"
                alt="스마트 에어콕 제품"
                fill
                sizes="(min-width: 1200px) 580px, (min-width: 1024px) 50vw, 100vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
