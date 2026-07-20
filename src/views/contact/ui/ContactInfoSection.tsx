import type { ReactNode } from 'react'
import { connection } from 'next/server'
import { cacheLife, cacheTag } from 'next/cache'
import { SITE } from '@/shared/config'
import { getSiteInfoServer, SITE_INFO_CACHE_TAG, type SiteInfo } from '@/entities/site-info'

// Footer와 동일한 폴백 헬퍼 — API가 빈 문자열/공백을 반환해도 SITE 상수로 폴백한다.
function pick(apiValue: string | null | undefined, fallback: string): string {
  return apiValue?.trim() ? apiValue : fallback
}

/**
 * 사이트 정보 조회를 'use cache'로 캐싱한다(cacheTag: 'site-info', cacheLife: static).
 * Footer와 동일 패턴 — 'use cache'는 서버 전용이므로 entity 페처가 아닌 서버 뷰에서 래핑한다.
 * 어드민 수정 시 revalidateSiteInfoCache(updateTag)로 무효화된다.
 */
async function getCachedSiteInfo(): Promise<SiteInfo> {
  'use cache'
  cacheLife('static')
  cacheTag(SITE_INFO_CACHE_TAG)
  return getSiteInfoServer()
}

/* 연락처 아이콘 — 이 섹션 로컬 전용(공용 분리 대상 아님). currentColor 상속 */
function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.5 3h3l1.5 4.5L9 9a12 12 0 0 0 6 6l1.5-2 4.5 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

type InfoCard = {
  icon: ReactNode
  label: string
  title: string
  value: string
  sub?: string
  href?: string
}

function InfoCardBody({ card }: { card: InfoCard }) {
  return (
    <>
      <span className="flex h-11 w-11 items-center justify-center rounded-btn bg-tint text-brand">
        {card.icon}
      </span>
      <p className="mt-5 font-display text-mini font-semibold uppercase tracking-eyebrow text-muted">
        {card.label}
      </p>
      <p className="mt-1 text-xs text-faint">{card.title}</p>
      <p className="mt-1.5 text-lg font-bold leading-snug text-ink [word-break:keep-all]">
        {card.value}
      </p>
      {card.sub && <p className="mt-1 text-sm text-muted">{card.sub}</p>}
    </>
  )
}

/**
 * INFO CARDS (시안 §INFO CARDS). surface 배경, 4열 아이콘 카드.
 * 대표번호/오시는 길/이메일 값은 site-info API(우선) → SITE 상수(fallback) 순으로 채운다.
 * 상담시간 카드는 백엔드 무관 안내 문구이므로 그대로 유지한다.
 */
export async function ContactInfoSection() {
  // 빌드 타임 프리렌더(백엔드 미기동)에서 fetch가 실행되지 않도록 요청 시점으로 미룬다(Footer 패턴).
  await connection()

  let siteInfo: SiteInfo | null = null
  try {
    siteInfo = await getCachedSiteInfo()
  } catch {
    siteInfo = null
  }

  const phone = pick(siteInfo?.phone, SITE.contact.phone)
  const address = pick(siteInfo?.address, SITE.contact.address)
  const email = pick(siteInfo?.email, SITE.contact.email)

  // 연락처 안내 4카드 — 이 페이지 전용 로컬 데이터. 값은 site-info/SITE에서 주입(하드코딩 금지),
  // 상담시간·안내 문구는 일반 텍스트로 허용.
  const cards: InfoCard[] = [
    {
      icon: <PhoneIcon />,
      label: 'CALL',
      title: '대표번호',
      value: phone,
      sub: '전화 상담 환영',
      href: `tel:${phone}`,
    },
    {
      icon: <PinIcon />,
      label: 'VISIT',
      title: '오시는 길',
      value: address,
    },
    {
      icon: <MailIcon />,
      label: 'EMAIL',
      title: '이메일',
      value: email,
      sub: '24시간 접수',
      href: `mailto:${email}`,
    },
    {
      icon: <ClockIcon />,
      label: 'HOURS',
      title: '상담시간',
      value: '평일 09:00–18:00',
      sub: '주말·공휴일 휴무',
    },
  ]

  return (
    <section className="bg-surface">
      <div className="content-container py-16 md:py-20">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const cardClass =
              'flex flex-col rounded-card border border-hairline bg-surface-white p-6 shadow-card'
            if (card.href) {
              return (
                <a
                  key={card.title}
                  href={card.href}
                  className={`${cardClass} transition-colors duration-fast ease-out hover:border-tint-border`}
                >
                  <InfoCardBody card={card} />
                </a>
              )
            }
            return (
              <div key={card.title} className={cardClass}>
                <InfoCardBody card={card} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
