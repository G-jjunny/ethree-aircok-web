import Image from 'next/image';
import { SITE } from '@/shared/config';

export function WhyChooseUsSection() {
  return (
    <section className="relative bg-surface-dark">
      {/* 배경 이미지 */}
      <Image
        src="/images/home/aircok_solution_bg.png"
        alt=""
        fill
        priority
        className="object-cover"
      />
      {/* 오버레이 — bg-overlay-dark-60(60%) 배경 이미지 일부 노출용 토큰 */}
      <div className="absolute inset-0 bg-overlay-dark-60" />

      <div className="content-container relative z-10 flex flex-col items-center gap-12 py-20 text-center">
        {/* 시그니처 — 핵심 메시지를 단일 대담 요소로 (Emphasis Quote 패턴) */}
        <div className="flex flex-col items-center gap-5">
          <span className="text-aircok-blue-light text-xs font-semibold uppercase tracking-widest">
            {SITE.whyUs.label}
          </span>
          <blockquote className="relative max-w-[820px] [word-break:keep-all]">
            <span
              className="text-aircok-blue-light font-display text-6xl leading-none select-none"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <p className="mt-2 text-[40px] font-display font-semibold text-heading-light leading-[1.10] tracking-[-0.3px]">
              {SITE.whyUs.emphasis}
            </p>
            <cite className="mt-4 block text-body-light text-sm not-italic opacity-70">
              — {SITE.name}
            </cite>
          </blockquote>
        </div>

        {/* 보조 포인트 — 시그니처 아래에서 절제된 3열 지지 콘텐츠 */}
        <ul className="grid w-full max-w-[960px] grid-cols-1 gap-px overflow-hidden rounded-xl border border-border-dark bg-border-dark md:grid-cols-3">
          {SITE.whyUs.points.map((point, index) => (
            <li
              key={index}
              className="bg-surface-dark-1 p-6 text-left"
            >
              <span aria-hidden="true" className="block h-0.5 w-8 bg-aircok-blue" />
              <p className="mt-4 text-[17px] text-body-light leading-[1.65] [word-break:keep-all]">
                {point}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
