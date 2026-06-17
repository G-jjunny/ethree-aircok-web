import { SITE } from '@/shared/config';

const STAT_NUMBERS: Record<string, string> = {
  Concentration: '50%',
  Value: '25%',
  Cost: '79%',
  'Air Quality': '46%',
};

export function StatSection() {
  return (
    <section className="bg-surface-dark">
      <div className="max-w-[1200px] mx-auto px-5 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SITE.stats.map((stat) => (
            <div key={stat.category} className="bg-surface-dark-1 rounded-xl p-8 flex flex-col gap-4">
              <span className="text-aircok-blue-light text-xs font-semibold uppercase tracking-widest">
                {stat.category}
              </span>
              <span className="text-5xl font-bold text-heading-light leading-none">
                {STAT_NUMBERS[stat.category]}
              </span>
              <h3 className="text-heading-light text-[21px] font-bold leading-[1.19] mt-2">
                {stat.title}
              </h3>
              <p className="text-body-light text-sm leading-[1.65] [word-break:keep-all] flex-1">
                {stat.description}
              </p>
              <p className="text-body-light opacity-50 text-xs italic mt-auto">
                {stat.source}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
