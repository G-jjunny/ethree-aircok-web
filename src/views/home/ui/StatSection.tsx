import Link from 'next/link';
import { SITE } from '@/shared/config';

export function StatSection() {
  return (
    <section className="bg-surface-white">
      <div className="max-w-[1200px] mx-auto px-5 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SITE.stats.map((stat) => (
            <div key={stat.category} className="flex flex-col gap-3 bg-surface-white border border-border-light rounded-lg p-6">
              <span className="text-aircok-blue text-xs font-semibold uppercase tracking-widest">
                {stat.category}
              </span>
              <h3 className="text-heading-dark text-[21px] font-bold leading-[1.19]">
                {stat.title}
              </h3>
              <p className="text-body-dark text-[17px] leading-[1.65] [word-break:keep-all] flex-1">
                {stat.description}
              </p>
              <p className="text-secondary-dark text-xs italic mt-auto">
                {stat.source}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10">
          <Link
            href={SITE.statsCta.href}
            className="border border-aircok-blue text-aircok-blue rounded-pill px-5 py-2.5 hover:underline transition-colors text-sm font-normal"
          >
            {SITE.statsCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
