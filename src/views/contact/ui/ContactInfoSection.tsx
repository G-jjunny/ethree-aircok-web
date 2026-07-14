import type { ReactNode } from 'react'
import { SITE } from '@/shared/config'

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

// 연락처 안내 4카드 — 이 페이지 전용 로컬 데이터. 값은 SITE에서 import(하드코딩 금지),
// 상담시간·안내 문구는 일반 텍스트로 허용.
const cards: InfoCard[] = [
  {
    icon: <PhoneIcon />,
    label: 'CALL',
    title: '대표번호',
    value: SITE.contact.phone,
    sub: '전화 상담 환영',
    href: `tel:${SITE.contact.phone}`,
  },
  {
    icon: <PinIcon />,
    label: 'VISIT',
    title: '오시는 길',
    value: SITE.contact.address,
  },
  {
    icon: <MailIcon />,
    label: 'EMAIL',
    title: '이메일',
    value: SITE.contact.email,
    sub: '24시간 접수',
    href: `mailto:${SITE.contact.email}`,
  },
  {
    icon: <ClockIcon />,
    label: 'HOURS',
    title: '상담시간',
    value: '평일 09:00–18:00',
    sub: '주말·공휴일 휴무',
  },
]

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
 * 대표번호/오시는 길/이메일/상담시간 — 값은 SITE에서 import.
 */
export function ContactInfoSection() {
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
