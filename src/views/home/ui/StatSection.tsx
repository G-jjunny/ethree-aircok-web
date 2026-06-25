import Link from 'next/link';

import { SITE } from '@/shared/config';
import { DarkStatCard } from '@/shared/ui';

const STAT_NUMBERS: Record<string, string> = {
  Concentration: '50%',
  Value: '25%',
  Cost: '79%',
  'Air Quality': '46%',
};

// Cost(79%) — 가장 임팩트 있는 수치를 시각적으로 부각하는 강조 카드
const HIGHLIGHT_CATEGORY = 'Cost';

export function StatSection() {
  return (
    <section className="bg-surface-dark">
      <div className="content-container py-20">
        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SITE.stats.map((stat) => (
            <DarkStatCard
              key={stat.category}
              category={stat.category}
              stat={STAT_NUMBERS[stat.category]}
              title={stat.title}
              description={stat.description}
              source={stat.source}
              highlight={stat.category === HIGHLIGHT_CATEGORY}
            />
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link
            href={SITE.statsCta.href}
            className="inline-flex min-h-[44px] items-center justify-center rounded-pill border border-border-dark px-8 text-nav font-medium text-aircok-blue-light transition-colors hover:bg-overlay-white-10"
          >
            {SITE.statsCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
