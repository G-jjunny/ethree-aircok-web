import { connection } from 'next/server'
import { cacheLife, cacheTag } from 'next/cache'
import { SITE } from '@/shared/config'
import { SectionHeader } from '@/shared/ui'
import { getPartnerListServer, PARTNERS_CACHE_TAG, type Partner } from '@/entities/partner'

/** 파트너 조회를 'use cache'로 캐싱(cacheTag: 'partners', cacheLife: static). */
async function getCachedPartners(): Promise<Partner[]> {
  'use cache'
  cacheLife('static')
  cacheTag(PARTNERS_CACHE_TAG)
  return getPartnerListServer()
}

export async function PartnersSection() {
  // 빌드 타임 프리렌더(백엔드 미기동)에서 fetch가 실행되지 않도록 요청 시점으로 미룬다.
  await connection()

  let apiPartners: Partner[] = []
  try {
    apiPartners = await getCachedPartners()
  } catch {
    apiPartners = []
  }

  const partnerNames: readonly string[] =
    apiPartners.length > 0
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
