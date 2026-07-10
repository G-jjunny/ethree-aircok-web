import Link from 'next/link';
import { SITE } from '@/shared/config';

const VALUE_META = [
  { num: '01', en: 'ACCURACY' },
  { num: '02', en: 'DIVERSITY' },
  { num: '03', en: 'CONVENIENCE' },
  { num: '04', en: 'CONNECTIVITY' },
];

/**
 * Our Value / 2x2 이미지 카드 (시안 §6). 흰 배경, 헤더(h2 + VIEW MORE 원형 화살표),
 * 2x2 카드(플레이스홀더 이미지 + 하단 그라디언트 오버레이 + 흰 텍스트).
 */
export function OurValueSection() {
  const features = SITE.whyUs.features;

  return (
    <section className="bg-surface-white py-24">
      <div className="content-container">
        {/* 헤더 */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-h2 font-extrabold tracking-headline text-ink">Our Value</h2>
            <p className="mt-3 max-w-md text-lead-sm text-muted">
              {SITE.whyUs.featuresTitle}
            </p>
          </div>
          <Link href="/services" className="group hidden items-center gap-3 sm:flex">
            <span className="font-display text-mini tracking-eyebrow text-muted">VIEW MORE</span>
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-hairline text-ink transition-colors duration-fast group-hover:border-brand group-hover:text-brand">
              →
            </span>
          </Link>
        </div>

        {/* 2x2 카드 */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {features.map((feature, i) => (
            <article
              key={feature.title}
              /* token 없음: Our Value 카드 11/9 비율 (aspect-featured 16/7·row-thumb 4/3 미대응 1회성) */
              className="relative aspect-[11/9] overflow-hidden rounded-image bg-linear-to-br from-navy-tint to-navy-deep"
            >
              {/* 하단 그라디언트 오버레이 */}
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-t from-navy-deep/90 via-navy-deep/20 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <div className="font-display text-mini tracking-eyebrow text-white/60">
                  {VALUE_META[i].num} · {VALUE_META[i].en}
                </div>
                <div className="mt-1 text-xl font-bold">{feature.title}</div>
                <p className="mt-1.5 line-clamp-2 text-sm text-white/70">
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
