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
    <section className="bg-surface-light">
      <div className="content-container flex flex-col items-center gap-10 py-20">
        <SectionHeader
          label={SITE.partners.label}
          title={SITE.partners.heading}
          body={SITE.partners.body}
          align="center"
        />

        <ul className="flex flex-wrap justify-center gap-3">
          {partnerNames.map((name) => (
            <li
              key={name}
              className="rounded-pill border border-border-light bg-surface-white px-5 py-2.5 text-sm font-medium text-body-dark transition-colors hover:border-aircok-blue hover:text-aircok-blue [word-break:keep-all]"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
