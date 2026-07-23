import { connection } from 'next/server'
import { cacheLife, cacheTag } from 'next/cache'
import { SITE } from '@/shared/config'
import { SectionLabel, LogoMarquee, ScrollReveal } from '@/shared/ui'
import { getPartnerListServer, PARTNERS_CACHE_TAG, type Partner } from '@/entities/partner'

async function getCachedPartners(): Promise<Partner[]> {
  'use cache'
  cacheLife('static')
  cacheTag(PARTNERS_CACHE_TAG)
  return getPartnerListServer()
}

export async function ClientsSection() {
  await connection()

  let apiPartners: Partner[] = []
  try {
    apiPartners = await getCachedPartners()
  } catch {
    apiPartners = []
  }

  const partners = apiPartners.filter((p) => p.type === 'partner')
  const { eyebrow, title } = SITE.about.partners

  const items = partners.map((p) => ({ name: p.name, logoUrl: p.logoUrl }))
  const fallbackItems = SITE.partners.list.map((name) => ({ name }))

  return (
    <section className="bg-surface py-24">
      <div className="content-container flex flex-col gap-12">
        <ScrollReveal variant="fade-up" className="mx-auto max-w-2xl text-center">
          <SectionLabel color="brand">{eyebrow}</SectionLabel>
          <h2 className="mt-4 text-h6 sm:text-h5 font-extrabold tracking-headline text-ink">
            {title}
          </h2>
        </ScrollReveal>

        {partners.length > 0 ? (
          <LogoMarquee
            items={items}
            rows={partners.length > 10 ? 2 : 1}
            ariaLabel="파트너사 로고"
          />
        ) : (
          <LogoMarquee items={fallbackItems} rows={1} ariaLabel="파트너사 로고" />
        )}
      </div>
    </section>
  )
}
