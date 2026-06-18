import { SITE } from '@/shared/config';
import { DarkStatCard } from '@/shared/ui';

const STAT_NUMBERS: Record<string, string> = {
  Concentration: '50%',
  Value: '25%',
  Cost: '79%',
  'Air Quality': '46%',
};

export function StatSection() {
  return (
    <section className="bg-surface-dark">
      <div className="content-container py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SITE.stats.map((stat) => (
            <DarkStatCard
              key={stat.category}
              category={stat.category}
              stat={STAT_NUMBERS[stat.category]}
              title={stat.title}
              description={stat.description}
              source={stat.source}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
