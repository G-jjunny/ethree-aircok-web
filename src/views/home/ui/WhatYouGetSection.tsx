import Link from 'next/link';
import { SITE } from '@/shared/config';
import { SectionHeader } from '@/shared/ui';

export function WhatYouGetSection() {
  return (
    <section className="bg-surface-light">
      <div className="content-container py-20">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* 좌측 콘텐츠 — 절제 (signature는 우측 패널에 집중) */}
          <div className="lg:w-[55%] flex flex-col">
            <SectionHeader
              label={SITE.whatYouGet.label}
              title={SITE.whatYouGet.title}
              theme="light"
            />

            <ul className="mt-8 flex flex-col gap-4">
              {SITE.whatYouGet.bullets.map((bullet, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="bg-aircok-blue rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-heading-light text-xs font-bold">✓</span>
                  </span>
                  <span className="text-body-dark text-[17px] leading-[1.65] [word-break:keep-all]">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-6 text-body-dark text-[17px] leading-[1.65] [word-break:keep-all]">
              {SITE.whatYouGet.body}
            </p>

            <Link
              href="/contact"
              className="mt-8 inline-flex items-center justify-center bg-aircok-blue text-heading-light rounded-md px-5 py-[10px] font-medium hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors min-h-[44px] self-start"
            >
              {SITE.whatYouGet.cta}
            </Link>
          </div>

          {/* 우측 signature — Navy Signature Stat Panel (단 하나의 지배적 수치 40+에 대담함 집중) */}
          <div className="lg:w-[45%] w-full">
            {/* token 없음: rounded-2xl signature 패널 시각적 무게 (radius-xl 16px보다 큼) */}
            <div className="relative overflow-hidden rounded-2xl bg-surface-stat px-8 py-10 sm:px-10 sm:py-12 flex flex-col gap-4">
              <span className="text-aircok-blue-light text-xs font-semibold uppercase tracking-widest">
                {SITE.whatYouGet.signature.label}
              </span>
              <span className="text-aircok-blue-light text-7xl sm:text-8xl font-display font-bold leading-none tracking-[-0.3px]">
                {SITE.whatYouGet.signature.value}
              </span>
              <p className="text-heading-light text-[21px] font-semibold leading-[1.19] [word-break:keep-all]">
                {SITE.whatYouGet.signature.title}
              </p>
              <p className="text-body-light opacity-70 text-sm leading-[1.65] [word-break:keep-all]">
                {SITE.whatYouGet.signature.caption}
              </p>

              {/* 보조 수치 — 절제, signature보다 작게 */}
              <div className="mt-2 grid grid-cols-3 gap-4 border-t border-border-dark pt-5">
                {SITE.whatYouGet.supportingStats.map((stat) => (
                  <div key={stat.value} className="flex flex-col gap-1">
                    <span className="text-heading-light text-2xl font-bold leading-none tracking-[-0.3px]">
                      {stat.value}
                    </span>
                    <span className="text-body-light opacity-60 text-xs leading-[1.4] [word-break:keep-all]">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
