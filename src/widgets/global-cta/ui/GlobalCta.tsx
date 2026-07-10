import Link from 'next/link';
import { SITE } from '@/shared/config';
import { Button } from '@/shared/ui';

/**
 * 전역 하단 CTA (시안 §10). brand 그라디언트 배경 + 우상단 화이트 글로우.
 * 좌: 헤드라인 + 서브카피, 우: 전화(white 버튼) + 도입 문의(outline).
 */
export function GlobalCta() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-brand to-brand-hover text-white">
      {/* 우상단 화이트 글로우 (장식). 크기는 1회성 장식 치수 — token 없음 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-20 h-[420px] w-[420px] rounded-full bg-radial from-white/18 to-transparent"
      />
      <div className="content-container relative flex flex-wrap items-center justify-between gap-6 py-20">
        <div>
          <h2 className="font-display text-h3 font-extrabold leading-tight tracking-headline">
            건강한 공기, 지금 시작하세요
          </h2>
          <p className="mt-3.5 text-base text-white/85">
            시설에 맞는 공기질 관리 솔루션을 상담해 드립니다.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3.5">
          <Button asChild variant="white" size="md">
            <a href={`tel:${SITE.contact.phone}`}>{SITE.contact.phone}</a>
          </Button>
          <Button asChild variant="outline" size="md">
            <Link href={SITE.bottomCta.ctaHref}>{SITE.cta.button}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
