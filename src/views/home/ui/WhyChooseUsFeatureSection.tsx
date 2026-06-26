import { SITE } from '@/shared/config';

export function WhyChooseUsFeatureSection() {
  return (
    <section className="bg-surface-dark">
      <div className="content-container pb-20">
        {/* WhyChooseUsSection 과 이어지는 다크 흐름의 두 번째 파트 — 얇은 구분선으로 연결 */}
        <div className="flex flex-col gap-3 border-t border-border-dark pt-16">
          <span className="text-aircok-blue-light text-xs font-semibold uppercase tracking-widest">
            {SITE.whyUs.featuresLabel}
          </span>
          <h3 className="text-[28px] font-display font-semibold text-heading-light leading-[1.10] tracking-[-0.3px] [word-break:keep-all] max-w-[720px]">
            {SITE.whyUs.featuresTitle}
          </h3>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SITE.whyUs.features.map((feature, index) => (
            <li
              key={index}
              className="group flex flex-col gap-4 rounded-xl bg-surface-dark-1 p-6 transition-colors duration-200 hover:bg-surface-dark-2"
            >
              <span aria-hidden="true" className="block h-0.5 w-10 bg-aircok-blue" />
              <h4 className="text-subheading font-bold font-display text-heading-light leading-[1.19]">
                {feature.title}
              </h4>
              <p className="text-[17px] text-body-light leading-[1.65] [word-break:keep-all]">
                {feature.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
