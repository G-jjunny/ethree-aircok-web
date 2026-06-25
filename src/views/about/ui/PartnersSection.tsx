'use client'
import { useQuery } from '@tanstack/react-query'
import { SITE } from '@/shared/config'
import { SectionHeader } from '@/shared/ui'
import { partnerListQueryOptions } from '@/entities/partner'

export function PartnersSection() {
  const { data: apiPartners, isError } = useQuery(partnerListQueryOptions())

  const partnerNames: readonly string[] =
    apiPartners && !isError && apiPartners.length > 0
      ? apiPartners.filter((p) => p.type === 'partner').map((p) => p.name)
      : SITE.partners.list

  return (
    <section className="bg-surface-dark py-20">
      <div className="content-container">
        <SectionHeader
          label={SITE.partners.label}
          title={SITE.partners.heading}
          body={SITE.partners.body}
          theme="dark"
        />
        <div className="flex flex-wrap gap-3 mt-8">
          {partnerNames.map((name) => (
            <span
              key={name}
              className="bg-overlay-white-10 text-heading-light rounded-pill px-4 py-2 text-sm"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
