import Link from 'next/link';
import { SITE } from '@/shared/config';

export function WhatYouGetSection() {
  return (
    <section className="bg-surface-white">
      <div className="max-w-[1200px] mx-auto px-5 py-20">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* 좌측 콘텐츠 */}
          <div className="flex-1 flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <span className="text-aircok-blue text-xs font-semibold uppercase tracking-widest">
                {SITE.whatYouGet.label}
              </span>
              <h2 className="text-heading-dark font-display text-3xl md:text-4xl font-semibold leading-tight tracking-tight">
                {SITE.whatYouGet.title}
              </h2>
            </div>

            <ul className="flex flex-col gap-4">
              {SITE.whatYouGet.bullets.map((bullet, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-aircok-blue text-xl font-bold shrink-0 mt-0.5">✓</span>
                  <span className="text-body-dark text-base leading-relaxed">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>

            <p className="text-body-dark text-base leading-relaxed">
              {SITE.whatYouGet.body}
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-aircok-blue text-heading-light rounded-md px-5 py-2.5 font-medium hover:bg-aircok-blue-dark transition-colors self-start"
            >
              {SITE.whatYouGet.cta}
            </Link>
          </div>

          {/* 우측 이미지 placeholder */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full aspect-square max-w-md bg-surface-light rounded-xl flex items-center justify-center">
              <span className="text-secondary-dark text-sm">이미지 영역</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
