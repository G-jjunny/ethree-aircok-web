import { SITE } from '@/shared/config';

export function FeatureSection() {
  return (
    <section className="bg-surface-white">
      <div className="max-w-[1200px] mx-auto px-5 py-9">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SITE.features.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-4">
              {/* 아이콘 placeholder */}
              <div className="w-12 h-12 bg-surface-light rounded-lg" />
              <div className="flex flex-col gap-2">
                <h3 className="text-heading-dark text-xl font-semibold">
                  {feature.title}
                </h3>
                <p className="text-body-dark text-base">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
