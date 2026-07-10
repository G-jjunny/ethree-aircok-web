import Link from 'next/link';
import { SITE } from '@/shared/config';
import { SectionLabel } from '@/shared/ui';
import styles from './ourvalue.module.css';

// 카드 로컬 메타: 번호·영문 eyebrow·플레이스홀더 줄무늬 명암.
// (제목 문구는 SITE.whyUs.features[].cardTitle 를 SSOT 로 사용)
const VALUE_META = [
  { num: '01', en: 'ACCURACY', tone: 'light' as const },
  { num: '02', en: 'DIVERSITY', tone: 'light' as const },
  { num: '03', en: 'CONVENIENCE', tone: 'dark' as const },
  { num: '04', en: 'CONNECTIVITY', tone: 'light' as const },
];

/**
 * Our Value (시안 §6). 흰 배경, 헤더(eyebrow + h2 + VIEW MORE 원형 화살표).
 * 데스크톱 3열×2행 그리드: [인트로 텍스트][카드01][카드02] / [카드03][카드04][빈 셀].
 * 카드는 줄무늬 플레이스홀더 + 하단 그라디언트 오버레이 + 흰 텍스트.
 */
export function WhyChooseUsSection() {
  const features = SITE.whyUs.features;

  return (
    <section className="bg-surface-white py-24">
      <div className="content-container">
        {/* 헤더 */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <SectionLabel color="brand">WHY CHOOSE US</SectionLabel>
            <h2 className="mt-3 text-h2 font-extrabold tracking-headline text-ink">Our Value</h2>
          </div>
          <Link href="/services" className="group hidden items-center gap-3 sm:flex">
            <span className="font-display text-mini tracking-eyebrow text-muted">VIEW MORE</span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-hairline text-ink transition-colors duration-fast group-hover:border-brand group-hover:text-brand">
              →
            </span>
          </Link>
        </div>

        {/* 3열 × 2행 그리드 */}
        <div className="mt-12 grid grid-cols-1 items-start gap-4 md:grid-cols-3">
          {/* 셀1 — 인트로 텍스트 (이미지 카드 아님) */}
          {/* 그리드 items-start 를 따라 카드와 같은 상단 라인에서 시작(top 정렬) */}
          <div className="flex flex-col">
            <h3 className="text-xl font-extrabold leading-snug tracking-headline text-ink">
              보이지 않는 공기질까지 스마트하게 관리하는{' '}
              <span className="text-brand">AIoT 통합 솔루션</span>입니다.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              거주자의 건강은 물론 기업 생산성과 건물 가치까지 높이는 스마트한 선택. 정확성·다양성·편리성·연계성
              네 가지 가치로 공기질 관리의 기준을 새롭게 정의합니다.
            </p>
          </div>

          {/* 셀2~5 — 이미지 카드 4장 */}
          {features.map((feature, i) => {
            const meta = VALUE_META[i];
            return (
              <article
                key={feature.title}
                /* token 없음: Our Value 카드 11/9 비율 (aspect-featured 16/7·row-thumb 4/3 미대응 1회성) */
                className="relative aspect-[11/9] overflow-hidden rounded-image"
              >
                {/* 줄무늬 플레이스홀더 (실 이미지 미확보) */}
                <div
                  aria-hidden
                  className={`absolute inset-0 ${
                    meta.tone === 'dark' ? styles.stripeDark : styles.stripeLight
                  }`}
                />
                {/* 하단 그라디언트 오버레이 (흰 텍스트 가독) */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-navy-deep/90 via-navy-deep/20 to-transparent"
                />
                {/* 우상단 번호 */}
                <div className="absolute right-5 top-4 font-display text-lg font-bold text-white/55">
                  {meta.num}
                </div>
                {/* 하단 라벨 + 타이틀 */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <SectionLabel color="cyan" size="sm">
                    {meta.en}
                  </SectionLabel>
                  <div className="mt-1.5 text-lg font-extrabold leading-snug text-white">
                    {feature.cardTitle}
                  </div>
                </div>
              </article>
            );
          })}

          {/* 셀6 — 빈 셀 (데스크톱 우하단만) */}
          <div aria-hidden className="hidden md:block" />
        </div>
      </div>
    </section>
  );
}
