import { SITE } from '@/shared/config';

export function MethodologySection() {
  return (
    <section className="bg-surface-white">
      <div className="max-w-[1200px] mx-auto px-5 py-20">
        {/* 헤더 */}
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-aircok-blue text-xs font-semibold uppercase tracking-widest">
            {SITE.methodology.label}
          </span>
          <h2 className="text-heading-dark font-display text-3xl md:text-4xl font-semibold leading-tight tracking-tight">
            {SITE.methodology.title}
          </h2>
          <p className="text-body-dark text-base leading-relaxed max-w-xl">
            {SITE.methodology.description}
          </p>
        </div>

        {/* 4단계 스텝 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-12">
          {SITE.methodology.steps.map((item) => (
            <div key={item.step} className="bg-surface-white rounded-xl shadow-card p-8 flex flex-col gap-4 relative">
              <span
                className="text-6xl font-bold text-aircok-blue opacity-20 leading-none absolute top-6 right-6 select-none"
                aria-hidden="true"
              >
                {item.step}
              </span>
              <span className="text-aircok-blue text-xs font-bold uppercase tracking-widest">
                STEP {String(item.step).padStart(2, '0')}
              </span>
              <h3 className="text-heading-dark text-xl font-semibold leading-[1.14] mt-2 [word-break:keep-all]">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
