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
      <ContactInfoSection />
      <ContactFormSection />
      {/* token 없음: min-h-[600px] FAQ 로딩 폴백 예약 높이(1회성 스켈레톤 수치) */}
      <Suspense fallback={<div className="min-h-[600px] bg-surface" />}>
        <ContactFaqSection />
      </Suspense>
    </main>
  )
}
