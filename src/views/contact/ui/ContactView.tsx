import { Suspense } from 'react'
import { PageHero } from '@/widgets/page-hero'
import { SITE } from '@/shared/config'
import { ContactInfoSection } from './ContactInfoSection'
import { ContactFormSection } from './ContactFormSection'
import { ContactFaqSection } from './ContactFaqSection'

export function ContactView() {
  return (
    <main>
      <PageHero
        eyebrow={SITE.pages.contact.hero.label}
        headline={{ prefix: SITE.pages.contact.title }}
        body={SITE.pages.contact.hero.body}
      />
      {/* ContactInfoSection은 site-info 서버 페치로 동적이므로 Suspense 경계로 감싼다.
          token 없음: min-h-[360px] INFO 카드 섹션 로딩 폴백 예약 높이(1회성 스켈레톤 수치) */}
      <Suspense fallback={<div className="min-h-[360px] bg-surface" />}>
        <ContactInfoSection />
      </Suspense>
      <ContactFormSection />
      {/* token 없음: min-h-[600px] FAQ 로딩 폴백 예약 높이(1회성 스켈레톤 수치) */}
      <Suspense fallback={<div className="min-h-[600px] bg-surface" />}>
        <ContactFaqSection />
      </Suspense>
    </main>
  )
}
