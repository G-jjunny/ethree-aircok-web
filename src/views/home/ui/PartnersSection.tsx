import { SITE } from '@/shared/config';

export function PartnersSection() {
  return (
    <section className="bg-surface-light">
      <div className="max-w-[1200px] mx-auto px-5 py-20">
        <h2 className="text-heading-dark font-display text-2xl md:text-3xl font-semibold text-center mb-10 [word-break:keep-all]">
          {SITE.partners.heading}
        </h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {SITE.partners.list.map((partner) => (
            <div key={partner} className="bg-surface-white rounded-lg px-4 py-3 text-sm font-medium text-body-dark shadow-card">
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
