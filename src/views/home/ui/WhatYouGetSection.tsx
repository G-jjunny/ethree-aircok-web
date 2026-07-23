import { Suspense } from 'react';
import Link from 'next/link';
import { SITE } from '@/shared/config';
import { Button, SectionLabel, ScrollReveal } from '@/shared/ui';
import { HomeSlotImage } from './HomeSlotImage';

const PLATFORM_RADIAL =
  'radial-gradient(120% 100% at 20% 0%, var(--color-navy-tint), var(--color-navy) 60%)';

/** 슬롯(HOME_REPORT_ILLUST) 미등록/스트리밍 대기 중 렌더할 빈 일러스트 자리. */
const ILLUST_FALLBACK = (
  <span className="absolute inset-0 flex items-center justify-center font-display text-nano tracking-eyebrow text-white/28">
    [ FREE REPORT 일러스트 자리 ]
  </span>
);

/**
 * 플랫폼 / 무료 레포트 (시안 §7). navy radial 다크 배경, 좌: eyebrow(cyan) + h2 +
 * 체크리스트 3 + pill CTA, 우: 슬롯 일러스트(미등록 시 플레이스홀더) + FREE REPORT 배지.
 *
 * 섹션은 정적 프레젠테이션이며 이미지 자리만 async 데이터 컴포넌트(HomeSlotImage)를
 * Suspense 경계로 감싸 스트리밍한다 — ScrollReveal(slide-right) 래핑 구조는 그대로다.
 */
export function WhatYouGetSection() {
  const { bullets, title, cta } = SITE.whatYouGet;

  return (
    <section
      className="text-white"
      style={{ backgroundImage: PLATFORM_RADIAL }}
    >
      <div className="content-container grid items-center gap-14 py-24 md:grid-cols-2">
        {/* 좌 */}
        <ScrollReveal variant="slide-left">
          <SectionLabel color="cyan">WHAT YOU GET</SectionLabel>
          <h2 className="mt-4 text-h6 sm:text-h3 font-extrabold leading-tight tracking-headline">
            {title}
          </h2>
          <ul className="mt-6 flex flex-col gap-4">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-cyan/16 text-sm font-bold text-cyan">
                  ✓
                </span>
                <span className="text-lead-sm leading-relaxed text-white/85">{bullet}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Button asChild pill variant="primary" size="md">
              <Link href="/diagnosis">{cta}</Link>
            </Button>
          </div>
        </ScrollReveal>

        {/* 우: 슬롯 일러스트(폴백=플레이스홀더) + FREE REPORT 배지 */}
        <ScrollReveal
          variant="slide-right"
          className="relative aspect-row-thumb overflow-hidden rounded-card border border-white/14 bg-white/5"
        >
          <Suspense fallback={ILLUST_FALLBACK}>
            <HomeSlotImage
              slot="HOME_REPORT_ILLUST"
              alt="무료 공기질 리포트 일러스트"
              sizes="(min-width: 768px) 50vw, 100vw"
              fit="contain"
              fallback={ILLUST_FALLBACK}
            />
          </Suspense>
          <span className="absolute right-5 top-5 rounded-pill bg-cyan/16 px-3.5 py-1.5 font-display text-mini font-bold tracking-eyebrow text-cyan">
            FREE REPORT
          </span>
        </ScrollReveal>
      </div>
    </section>
  );
}
