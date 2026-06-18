import { SITE } from '@/shared/config'
import { SectionHeader } from '@/shared/ui'

export function PartnersSection() {
  return (
    <section className="bg-surface-dark py-20">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="mb-8">
          <SectionHeader
            label={SITE.partners.label}
            title={SITE.partners.heading}
            body={SITE.partners.body}
            theme="dark"
          />
        </div>
        <div className="flex flex-wrap gap-3 mt-8">
          {SITE.partners.list.map((partner) => (
            <span
              key={partner}
              className="bg-overlay-white-10 text-heading-light rounded-pill px-4 py-2 text-sm"
            >
              {partner}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
