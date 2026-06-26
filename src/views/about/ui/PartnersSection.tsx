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

function resolveLogoSrc(src: string): string {
  return src.startsWith('http') ? src : `${API_BASE}${src}`
}

/** 이름 텍스트 칩 폴백 (API 실패·빈 목록·logoUrl 없음 공용) */
function NameChip({ name }: { name: string }) {
  return (
    <span className="bg-overlay-white-10 text-heading-light rounded-pill px-4 py-2 text-sm">
      {name}
    </span>
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
      <section className="bg-surface-dark py-24">
        <div className="content-container flex flex-col gap-14">
          <SectionHeader
            label={SITE.partners.label}
            title={SITE.partners.heading}
            body={SITE.partners.body}
            theme="dark"
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
    <section className="bg-surface-dark py-24">
      <div className="content-container flex flex-col gap-14">
        <SectionHeader
          label={SITE.partners.label}
          title={SITE.partners.heading}
          body={SITE.partners.body}
          theme="dark"
        />
        {/* 로고 월 — 다크 배경에서 로고가 묻히지 않도록 흰 타일 위에 배치, 균일 셀 그리드 */}
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {partners.map((partner) => (
            <li key={partner.id}>
              {partner.logoUrl ? (
                <div className="flex h-20 w-full items-center justify-center overflow-hidden rounded-lg bg-surface-white px-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveLogoSrc(partner.logoUrl)}
                    alt={partner.name}
                    width={128}
                    height={56}
                    loading="lazy"
                    className="max-h-10 w-auto object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-20 w-full items-center justify-center rounded-lg bg-overlay-white-10 px-6 text-center">
                  <span className="text-sm text-body-light [word-break:keep-all]">
                    {partner.name}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
