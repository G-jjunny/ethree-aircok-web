'use client'
import { useQuery } from '@tanstack/react-query'
import { SITE } from '@/shared/config'
import { SectionHeader } from '@/shared/ui'
import { partnerListQueryOptions, type Partner } from '@/entities/partner'

/**
 * 백엔드 API 베이스 URL. 동적/외부 호스트 로고는 next/image 대신 <img>를 쓰는 것이
 * 프로젝트 컨벤션(NewsImage·admin PartnerListSection 패턴)이다.
 * shared/config import는 FSD 위반이 아니지만, 절대경로 보정은 NewsImage와 동일하게 env로 처리한다.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

/** 정적 그리드 → 2줄 마퀴 전환 기준 개수 */
const MARQUEE_THRESHOLD = 10

function resolveLogoSrc(src: string): string {
  return src.startsWith('http') ? src : `${API_BASE}${src}`
}

/** 이름 텍스트 칩 폴백 (API 실패·빈 목록 공용) */
function NameChip({ name }: { name: string }) {
  return (
    <span className="bg-surface-white border border-border-light text-heading-dark rounded-pill px-4 py-2 text-sm">
      {name}
    </span>
  )
}

/**
 * 로고 타일 — 정적 그리드/마퀴 양쪽에서 공유하는 로컬 컴포넌트.
 * 고정폭을 갖지 않고 부모 폭에 맞춰 채운다(`w-full h-20`) — 정적 그리드에서는
 * grid item(`<li>`)의 셀 폭을 그대로 채우고, 마퀴 경로에서는 `LogoMarqueeRow`가
 * `w-40 shrink-0` 래퍼로 고정폭을 부여한다. 자세한 근거는 design.md
 * "Dual-Row Logo Marquee" 패턴의 "타일 고정폭 분리" 항목 참조.
 */
function LogoTile({ partner }: { partner: Partner }) {
  return partner.logoUrl ? (
    <div className="relative group flex h-20 w-full items-center justify-center overflow-hidden rounded-lg bg-surface-white border border-border-light px-6">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolveLogoSrc(partner.logoUrl)}
        alt={partner.name}
        width={128}
        height={56}
        loading="lazy"
        className="max-h-10 max-w-full w-auto object-contain transition-opacity duration-200 group-hover:opacity-30"
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="text-xs font-semibold text-heading-dark text-center px-2 [word-break:keep-all]">
          {partner.name}
        </span>
      </div>
    </div>
  ) : (
    <div className="relative group flex h-20 w-full items-center justify-center overflow-hidden rounded-lg bg-surface-white border border-border-light px-6 text-center">
      <span className="text-sm text-body-dark [word-break:keep-all] transition-opacity duration-200 group-hover:opacity-0">
        {partner.name}
      </span>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="text-xs font-semibold text-heading-dark text-center px-2 [word-break:keep-all]">
          {partner.name}
        </span>
      </div>
    </div>
  )
}

/** 2줄 마퀴 중 한 줄 — 로고 배열을 2배 복제해 무한 루프 */
function LogoMarqueeRow({
  partners,
  direction,
}: {
  partners: Partner[]
  direction: 'left' | 'right'
}) {
  const doubled = [...partners, ...partners]
  return (
    <div className="overflow-hidden">
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

export function PartnersSection() {
  const { data: apiPartners, isError } = useQuery(partnerListQueryOptions())

  const partners: Partner[] =
    apiPartners && !isError
      ? apiPartners.filter((p) => p.type === 'partner')
      : []

  // API 실패 또는 빈 목록 -> 기존 SITE.partners.list 이름 칩 폴백
  if (partners.length === 0) {
    return (
      <section className="bg-surface-light border-t border-border-light py-24">
        <div className="content-container flex flex-col gap-14">
          <SectionHeader
            label={SITE.partners.label}
            title={SITE.partners.heading}
            body={SITE.partners.body}
            theme="light"
          />
          <div className="flex flex-wrap gap-3">
            {SITE.partners.list.map((name) => (
              <NameChip key={name} name={name} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-surface-light border-t border-border-light py-24">
      <div className="content-container flex flex-col gap-14">
        <SectionHeader
          label={SITE.partners.label}
          title={SITE.partners.heading}
          body={SITE.partners.body}
          theme="light"
        />
        {/* 로고 월 — 흰 타일 위에 배치, 10개 초과 시 2줄 반대 방향 무한 마퀴 */}
        {partners.length > MARQUEE_THRESHOLD ? (
          <div className="flex flex-col gap-4">
            <LogoMarqueeRow
              partners={partners.filter((_, i) => i % 2 === 0)}
              direction="right"
            />
            <LogoMarqueeRow
              partners={partners.filter((_, i) => i % 2 === 1)}
              direction="left"
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
