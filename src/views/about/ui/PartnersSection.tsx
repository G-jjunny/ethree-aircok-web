import { connection } from 'next/server'
import { cacheLife, cacheTag } from 'next/cache'
import { SITE } from '@/shared/config'
import { SectionLabel, LogoMarquee } from '@/shared/ui'
import { getPartnerListServer, PARTNERS_CACHE_TAG, type Partner } from '@/entities/partner'

/** 파트너 조회를 'use cache'로 캐싱(cacheTag: 'partners', cacheLife: static). */
async function getCachedPartners(): Promise<Partner[]> {
  'use cache'
  cacheLife('static')
  cacheTag(PARTNERS_CACHE_TAG)
  return getPartnerListServer()
}

/**
 * OUR PARTNERS (시안 §OUR PARTNERS). surface 배경, 중앙 헤더 + 로고 마퀴.
 * partner entity 데이터 연동 유지(빈 목록/에러 시 SITE.partners.list 이름 칩 폴백).
 * 마퀴 렌더는 공용 LogoMarquee 컴포넌트로 위임.
 */
export async function PartnersSection() {
  // 빌드 타임 프리렌더(백엔드 미기동)에서 fetch가 실행되지 않도록 요청 시점으로 미룬다.
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
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel color="brand">{eyebrow}</SectionLabel>
          <h2 className="mt-4 text-h5 font-extrabold tracking-headline text-ink">
            {title}
          </h2>
        </div>

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
