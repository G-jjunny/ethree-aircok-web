import { SITE } from '@/shared/config'

const COPY = {
  kicker: '10만원! 5일! 투자로',
  titleLines: ['당신이 마시는 공기,', '안심 진단으로 확인하세요'],
  ctaPhone: '전화로 신청하기',
  ctaMail: '메일 문의',
  contactPrefix: '문의 ',
  mailPrefix: ' · mail ',
} as const

// brand 그라디언트 — 토큰 var() 참조, 하드코딩 아님
const CTA_GRADIENT =
  'linear-gradient(120deg, var(--color-brand), var(--color-brand-hover))'

/**
 * 하단 상담 CTA — 정적 brand 그라디언트 섹션.
 * 전화/메일은 SITE.contact / SITE.footer 상수에서 가져온다(하드코딩 금지).
 */
export function ContactCtaSection() {
  const { phone } = SITE.contact
  const email = SITE.footer.email2

  return (
    <section
      className="relative overflow-hidden bg-brand text-white"
      style={{ backgroundImage: CTA_GRADIENT }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-20 size-105 rounded-full bg-white/18 blur-xl"
      />
      <div className="content-container relative flex flex-wrap items-center justify-between gap-8.5 py-19">
        <div>
          <div className="text-base font-bold text-white/85">{COPY.kicker}</div>
          <h2 className="mt-2.5 text-h4 font-extrabold leading-tight tracking-headline">
            {COPY.titleLines[0]}
            <br />
            {COPY.titleLines[1]}
          </h2>
          <p className="mt-4 text-base text-white/82">
            {COPY.contactPrefix}
            <b>{phone}</b>
            {COPY.mailPrefix}
            <b>{email}</b>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3.5">
          <a
            href={`tel:${phone}`}
            className="rounded-btn bg-surface-white px-7.5 py-4 text-lg font-bold text-brand shadow-soft"
          >
            {COPY.ctaPhone}
          </a>
          <a
            href={`mailto:${email}`}
            className="rounded-btn border border-white/50 px-7.5 py-4 text-lg font-semibold text-white"
          >
            {COPY.ctaMail}
          </a>
        </div>
      </div>
    </section>
  )
}
