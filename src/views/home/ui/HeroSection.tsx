import Image from 'next/image';
import Link from 'next/link';
import { SITE } from '@/shared/config';

export function HeroSection() {
  return (
    <section className="bg-surface-dark min-h-[calc(100vh-52px)]">
      {/* min-h-[calc(100vh-52px)]: Nav 높이 52px 제외 — 1회성 레이아웃 수치 */}
      <div className="content-container flex items-center min-h-[calc(100vh-52px)]">
        <div className="flex flex-col lg:flex-row gap-16 items-center py-20 w-full">
          {/* 좌측 콘텐츠 */}
          <div className="lg:w-3/5 flex flex-col">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-semibold text-heading-light leading-[1.07] tracking-tight [word-break:keep-all]">
              {SITE.tagline}
            </h1>

            <p className="mt-6 text-body-light max-w-xl text-[21px] leading-[1.65] [word-break:keep-all]">
              {SITE.hero.subtitle}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="bg-aircok-blue text-heading-light rounded-md px-5 py-[10px] font-medium hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors min-h-[44px] inline-flex items-center justify-center"
              >
                {SITE.hero.cta.primary}
              </Link>
              <Link
                href="/services"
                className="border border-heading-light text-heading-light rounded-pill px-5 py-[10px] hover:bg-overlay-white-10 transition-colors min-h-[44px] inline-flex items-center justify-center"
              >
                {SITE.hero.cta.secondary}
              </Link>
            </div>
          </div>

          {/* 우측 이미지 */}
          <div className="lg:w-2/5 w-full flex items-center justify-center">
            <div className="relative w-full aspect-square">
              <Image
                src="/images/home/aircok_product.png"
                alt="스마트 에어콕 제품"
                fill
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
