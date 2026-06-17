import { SITE } from '@/shared/config';

export function WhyChooseUsSection() {
  return (
    <section className="bg-surface-dark">
      <div className="max-w-[1200px] mx-auto px-5 py-20">
        <div className="flex flex-col gap-12">
          {/* 헤더 */}
          <div className="flex flex-col gap-3">
            <span className="text-aircok-blue-light text-xs font-semibold uppercase tracking-widest">
              {SITE.whyUs.label}
            </span>
            <h2 className="text-heading-light font-display text-3xl md:text-4xl font-semibold leading-tight tracking-tight">
              {SITE.whyUs.title}
            </h2>
          </div>

          {/* Points */}
          <div className="flex flex-col gap-6">
            {SITE.whyUs.points.map((point, index) => (
              <p key={index} className="text-body-light text-base leading-relaxed">
                {point}
              </p>
            ))}
          </div>

          {/* 강조 문구 */}
          <p className="text-heading-light font-display text-3xl md:text-4xl font-semibold leading-tight text-center">
            {SITE.whyUs.emphasis}
          </p>
        </div>
      </div>
    </section>
  );
}
