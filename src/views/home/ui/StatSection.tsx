import Link from 'next/link';

import { SITE } from '@/shared/config';
import { LightStatCard, SectionHeader } from '@/shared/ui';

const STAT_NUMBERS: Record<string, string> = {
  Concentration: '50%',
  Value: '25%',
  Cost: '79%',
  'Air Quality': '46%',
};

export function StatSection() {
  return (
    // Air Spine Continuum: 다크 hero → 라이트 섹션 하드 엣지 전환.
    // 넉넉한 상단 여백 + 최상단 Air Spine 수직 룰로 경계를 시각적으로 잇는다.
    <section className="bg-surface-light">
      <div className="content-container pb-20 pt-24 sm:pt-28">
        {/* Air Spine 재사용 — hero의 수직 블루 룰을 라이트 섹션 상단에 배치해 다크→라이트 연결감 부여 */}
        <span aria-hidden="true" className="mb-6 block h-6 w-0.5 bg-aircok-blue" />
        <SectionHeader
          theme="light"
          label={SITE.home.statsHeader.eyebrow}
          title={SITE.home.statsHeader.title}
          body={SITE.home.statsHeader.body}
        />
        <div className="mt-12 grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SITE.stats.map((stat) => (
            <LightStatCard
              key={stat.category}
              category={stat.category}
              stat={STAT_NUMBERS[stat.category]}
              title={stat.title}
              description={stat.description}
              source={stat.source}
            />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link
            href={SITE.statsCta.href}
            className="inline-flex min-h-[44px] items-center justify-center rounded-pill border border-border-light px-8 text-nav font-medium text-aircok-blue transition-colors hover:bg-surface-white"
          >
            {SITE.statsCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
