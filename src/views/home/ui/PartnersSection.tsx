import { SITE } from '@/shared/config';

export function PartnersSection() {
  return (
    <section className="bg-surface-dark">
      <div className="max-w-[1200px] mx-auto px-5 py-9">
        <h2 className="text-heading-light font-display text-2xl md:text-3xl font-semibold mb-8 text-center">
          {SITE.partners.heading}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {SITE.partners.list.map((partner) => (
            <div key={partner} className="flex flex-col gap-2 items-center">
              <div className="bg-surface-dark-1 rounded-lg w-full aspect-video flex items-center justify-center">
                <span className="text-body-light text-xs text-center px-2 leading-tight">
                  {partner}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
