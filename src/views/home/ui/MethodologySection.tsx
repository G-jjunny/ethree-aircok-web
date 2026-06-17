import { SITE } from '@/shared/config';

export function MethodologySection() {
  return (
    <section className="bg-surface-light">
      <div className="max-w-[1200px] mx-auto px-5 py-20">
        <div className="flex flex-col items-center gap-12">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {SITE.methodology.steps.map((item) => (
              <div key={item.step} className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 bg-aircok-blue rounded-full flex items-center justify-center shrink-0">
                  <span className="text-heading-light text-base font-bold">{item.step}</span>
                </div>
                <p className="text-heading-dark text-base font-medium text-center">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
