import { SITE } from '@/shared/config';

export function WhyChooseUsFeatureSection() {
  return (
    <section className="bg-surface-dark">
      <div className="content-container pb-20">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SITE.whyUs.features.map((feature, index) => (
            <li
              key={index}
              className="bg-surface-dark-1 rounded-xl p-6 flex flex-col gap-3"
            >
              <h3 className="text-[21px] font-bold text-heading-light leading-[1.19] font-display">
                {feature.title}
              </h3>
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
