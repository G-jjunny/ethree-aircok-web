import Link from 'next/link';
import { SITE } from '@/shared/config';
import { SectionHeader } from '@/shared/ui';

const STAT_HIGHLIGHTS = [
  { value: '50%', label: '집중력 향상' },
  { value: '79%', label: '에너지 비용 최대 절감' },
  { value: '46%', label: '공기질 최대 개선' },
] as const;

export function WhatYouGetSection() {
  return (
    <section className="bg-surface-light">
      <div className="content-container py-20">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* 좌측 콘텐츠 */}
          <div className="lg:w-[60%] flex flex-col">
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

          {/* 우측 수치 카드 스택 */}
          <div className="lg:w-[40%] flex flex-col gap-4">
            {STAT_HIGHLIGHTS.map((stat) => (
              <div key={stat.value} className="bg-surface-white rounded-xl shadow-card p-6">
                <p className="text-3xl font-bold text-aircok-blue leading-none">{stat.value}</p>
                <p className="text-heading-dark font-medium mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
