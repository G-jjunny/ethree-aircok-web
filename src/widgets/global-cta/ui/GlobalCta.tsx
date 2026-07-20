import Link from 'next/link';
import { SITE } from '@/shared/config';
import { Button } from '@/shared/ui';

/**
 * 전역 하단 CTA (시안 §10). brand 그라디언트(120°) + 우상단 화이트 글로우.
 * 좌: eyebrow + 헤드라인 + 서브카피 + 메일 연락처, 우: 전화(white 버튼) + 도입 문의(outline).
 *
 * 시각 언어(120° 그라디언트·토큰 기반 글로우·2단 배치·연락처 라인)는 유지하되, 특정 페이지에
 * 특화된 문구(가격/기간 등)는 배제하고 전역에서 재사용 가능한 범용 메시지를 유지한다. 색상·간격·
 * 글로우 치수는 모두 design.md 토큰(var/유틸)이며 하드코딩 없음.
 */
export function GlobalCta() {
  const { phone } = SITE.contact;
  const email = SITE.footer.email2;

  return (
    <section className="relative overflow-hidden bg-linear-120 from-brand to-brand-hover text-white">
      {/* 우상단 화이트 글로우 (aria-hidden 장식). size-105=420px 스페이싱 토큰 기반 — 하드코딩 치수 제거 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-20 size-105 rounded-full bg-white/18 blur-xl"
      />
      <div className="content-container relative flex flex-wrap items-center justify-between gap-8 py-20">
        <div>
          <p className="font-display text-eyebrow font-semibold uppercase tracking-eyebrow-lg text-white/80">
            Clean air starts here
          </p>
          <h2 className="mt-2.5 text-h3 font-extrabold leading-tight tracking-headline">
            건강한 공기, 지금 시작하세요
          </h2>
          <p className="mt-3.5 text-base text-white/85">
            시설에 맞는 공기질 관리 솔루션을 상담해 드립니다.
          </p>
          <p className="mt-3 text-sm text-white/70">
            메일 문의 <span className="font-semibold text-white/90">{email}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3.5">
          <Button asChild variant="white" size="md">
            <a href={`tel:${phone}`}>{phone}</a>
          </Button>
          <Button asChild variant="outline" size="md">
            <Link href={SITE.bottomCta.ctaHref}>{SITE.cta.button}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
