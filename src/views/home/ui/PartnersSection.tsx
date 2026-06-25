'use client'
import { useQuery } from '@tanstack/react-query'
import { SITE } from '@/shared/config'
import { partnerListQueryOptions } from '@/entities/partner'

export function PartnersSection() {
  const { data: apiPartners, isError } = useQuery(partnerListQueryOptions())

  const partnerNames: readonly string[] =
    apiPartners && !isError && apiPartners.length > 0
      ? apiPartners.filter((p) => p.type === 'partner').map((p) => p.name)
      : SITE.partners.list

  return (
    <section className="bg-surface-light">
      <div className="content-container py-20">
        <h2 className="text-heading-dark font-display text-[28px] font-semibold text-center mb-10 [word-break:keep-all]">
          {SITE.partners.heading}
        </h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {partnerNames.map((name) => (
            <div key={name} className="bg-surface-white rounded-lg px-4 py-3 text-sm font-medium text-body-dark shadow-card">
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
