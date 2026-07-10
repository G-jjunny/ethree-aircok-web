import Link from 'next/link';
import { Button } from '@/shared/ui';
import { HeroAqiCard } from './HeroAqiCard';
import styles from './hero.module.css';

const HERO_RADIAL =
  'radial-gradient(120% 90% at 78% 0%, var(--color-navy-tint), var(--color-navy) 55%, var(--color-navy-deep) 100%)';

const STATS = [
  { value: '1', unit: '등급', label: 'KCL·KTR 성능인증' },
  { value: '9', unit: '종', label: '동시 측정 센서' },
  { value: '2018', unit: '', label: '환경 IT 전문 창립' },
];

/**
 * 히어로 (시안 §2). 다크 radial 배경 + 드리프트 글로우, 좌: 카피/CTA/통계,
 * 우: 실시간 공기질 카드(HeroAqiCard, client).
 */
export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{ backgroundImage: HERO_RADIAL }}
    >
      {/* 드리프트 글로우 (장식). 크기는 1회성 장식 치수 — token 없음 */}
      <div
        aria-hidden
        className={`${styles.driftA} pointer-events-none absolute -right-36 -top-20 h-[620px] w-[620px] rounded-full bg-radial from-brand/50 to-transparent blur-2xl`}
      />
      <div
        aria-hidden
        className={`${styles.driftB} pointer-events-none absolute -bottom-32 right-32 h-[420px] w-[420px] rounded-full bg-radial from-cyan/40 to-transparent blur-2xl`}
      />

      <div className="content-container relative grid items-center gap-14 py-24 md:grid-cols-[1.05fr_0.95fr]">
        {/* 좌: 카피 */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-pill border border-brand/40 bg-brand/12 px-3.5 py-1.5 text-eyebrow font-semibold text-brand-soft">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan" />
            AIoT 실내 공기질 관리 플랫폼
          </div>

          <h1 className="mt-6 text-hero font-extrabold leading-[1.08] tracking-headline">
            보이지 않는 공기를
            <br />
            <span className="text-brand">콕콕</span> 집어 관리하다
          </h1>

          <p className="mt-5 max-w-[500px] text-lead leading-relaxed text-white/68">
            9종 센서로 실내 공기질을 실시간 측정·진단하고, AIoT 클라우드 플랫폼이 필요한
            행동요령까지 알려드립니다. 국민 모두가 언제 어디서나 건강한 공기를 마실 수 있는
            공간을 만듭니다.
          </p>

          <div className="mt-6 flex flex-wrap gap-3.5">
            <Button asChild variant="primary" size="md">
              <Link href="/services">제품 살펴보기 →</Link>
            </Button>
            <Button asChild variant="outline" size="md">
              <Link href="/contact">도입 상담 신청</Link>
            </Button>
          </div>

          <div className="mt-11 flex flex-wrap gap-6">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-h6 font-extrabold">
                  {stat.value}
                  {stat.unit && <span className="text-cyan">{stat.unit}</span>}
                </div>
                <div className="mt-0.5 text-sm text-white/55">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 우: 실시간 카드 */}
        <HeroAqiCard />
      </div>
    </section>
  );
}
