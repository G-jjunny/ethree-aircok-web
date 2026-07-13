import Image from 'next/image'
import { connection } from 'next/server'
import { cacheLife, cacheTag } from 'next/cache'
import { SITE } from '@/shared/config'
import { SectionLabel } from '@/shared/ui'
import { getPartnerListServer, PARTNERS_CACHE_TAG, type Partner } from '@/entities/partner'

/** 파트너 조회를 'use cache'로 캐싱(cacheTag: 'partners', cacheLife: static). */
async function getCachedPartners(): Promise<Partner[]> {
  'use cache'
  cacheLife('static')
  cacheTag(PARTNERS_CACHE_TAG)
  return getPartnerListServer()
}

/** 백엔드 API 베이스 URL(상대 경로 로고 폴백용). */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

/** 정적 그리드 → 2줄 마퀴 전환 기준 개수 */
const MARQUEE_THRESHOLD = 10

// 마퀴 페이드 마스크(양끝 투명) — 마스킹 기법이므로 inline 처리(색/간격 토큰 아님).
const MARQUEE_MASK =
  'linear-gradient(to right, transparent, black 12%, black 88%, transparent)'

/**
 * R2(절대 http URL)는 그대로, 상대 경로(/uploads/...)는 동일 출처 rewrite로 서빙되도록
 * 상대 경로 유지 → next/image가 remotePatterns 없이 최적화한다.
 */
function resolveLogoSrc(src: string): string {
  if (src.startsWith('http')) return src
  return src.startsWith('/') ? src : `${API_BASE}${src}`
}

/** 이름 텍스트 칩 폴백 (API 실패·빈 목록 공용) */
function NameChip({ name }: { name: string }) {
  return (
    <span className="rounded-pill border border-hairline bg-surface-white px-4 py-2 text-sm text-ink">
      {name}
    </span>
  )
}

/**
 * 로고 타일 — 정적 그리드/마퀴 양쪽에서 공유하는 로컬 컴포넌트.
 * 부모 폭에 맞춰 채운다(`w-full h-20`) — 마퀴 경로에서는 `LogoMarqueeRow`가
 * `w-40 shrink-0` 래퍼로 고정폭을 부여한다.
 */
function LogoTile({ partner }: { partner: Partner }) {
  return partner.logoUrl ? (
    <div className="group relative flex h-20 w-full items-center justify-center overflow-hidden rounded-btn border border-hairline bg-surface-white px-6">
      <Image
        src={resolveLogoSrc(partner.logoUrl)}
        alt={partner.name}
        width={128}
        height={56}
        sizes="128px"
        className="max-h-10 w-auto max-w-full object-contain transition-opacity duration-fast group-hover:opacity-30"
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-fast group-hover:opacity-100">
        <span className="px-2 text-center text-xs font-semibold text-ink">
          {partner.name}
        </span>
      </div>
    </div>
  ) : (
    <div className="group relative flex h-20 w-full items-center justify-center overflow-hidden rounded-btn border border-hairline bg-surface-white px-6 text-center">
      <span className="text-sm text-muted transition-opacity duration-fast group-hover:opacity-0">
        {partner.name}
      </span>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-fast group-hover:opacity-100">
        <span className="px-2 text-center text-xs font-semibold text-ink">
          {partner.name}
        </span>
      </div>
    </div>
  )
}

/** 2줄 마퀴 중 한 줄 — 로고 배열을 2배 복제해 무한 루프 (CSS 애니메이션 전용) */
function LogoMarqueeRow({
  partners,
  direction,
}: {
  partners: Partner[]
  direction: 'left' | 'right'
}) {
  const doubled = [...partners, ...partners]
  return (
    <div
      className="overflow-hidden"
      style={{ maskImage: MARQUEE_MASK, WebkitMaskImage: MARQUEE_MASK }}
    >
      <div
        className={`flex w-max gap-4 ${
          direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
        } hover:[animation-play-state:paused]`}
      >
        {doubled.map((partner, i) => (
          <div key={`${partner.id}-${i}`} className="w-40 shrink-0">
            <LogoTile partner={partner} />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * OUR PARTNERS (시안 §OUR PARTNERS). surface 배경, 중앙 헤더 + 2줄 반대 방향 마퀴.
 * partner entity 데이터 연동 유지(빈 목록/에러 시 SITE.partners.list 이름 칩 폴백).
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

  return (
    <section className="bg-surface py-24">
      <div className="content-container flex flex-col gap-12">
        {/* token 없음: max-w-[640px] 중앙 정렬 헤더 프로즈 폭(1회성) */}
        <div className="mx-auto max-w-[640px] text-center">
          <SectionLabel color="brand">{eyebrow}</SectionLabel>
          <h2 className="mt-4 text-h5 font-extrabold tracking-headline text-ink">
            {title}
          </h2>
        </div>

        {partners.length === 0 ? (
          // API 실패 또는 빈 목록 -> 기존 SITE.partners.list 이름 칩 폴백
          <div className="flex flex-wrap justify-center gap-3">
            {SITE.partners.list.map((name) => (
              <NameChip key={name} name={name} />
            ))}
          </div>
        ) : partners.length > MARQUEE_THRESHOLD ? (
          <div className="flex flex-col gap-4">
            <LogoMarqueeRow
              partners={partners.filter((_, i) => i % 2 === 0)}
              direction="left"
            />
            <LogoMarqueeRow
              partners={partners.filter((_, i) => i % 2 === 1)}
              direction="right"
            />
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {partners.map((partner) => (
              <li key={partner.id}>
                <LogoTile partner={partner} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
