import { Suspense } from 'react'
import { SectionLabel } from '@/shared/ui'
import { InquiryForm } from '@/features/inquiry-form'
import { ContactMap } from './ContactMap'

/**
 * FORM + MAP (시안 §FORM + MAP). 흰 배경 2열.
 * 좌: 문의 폼(features/inquiry-form) / 우: sticky 지도 카드(ContactMap).
 */
export function ContactFormSection() {
  return (
    <section id="form" className="scroll-mt-24 bg-surface-white">
      <div className="content-container py-20 md:py-24">
        <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          {/* 좌: 문의 폼 */}
          <div>
            <SectionLabel color="brand">Inquiry</SectionLabel>
            <h2 className="mt-4 text-h4 font-extrabold tracking-headline text-ink">
              문의 남기기
            </h2>
            <p className="mt-4 text-lead-sm leading-relaxed text-muted [word-break:keep-all]">
              <span className="text-error">*</span> 표시는 필수 항목입니다. 남겨주신
              내용을 확인한 뒤 담당자가 빠르게 연락드리겠습니다.
            </p>
            <div className="mt-8">
              <InquiryForm />
            </div>
          </div>

          {/* 우: sticky 지도 카드 */}
          <div className="lg:sticky lg:top-24">
            <Suspense
              fallback={
                <div className="aspect-video w-full overflow-hidden rounded-card border border-hairline bg-surface" />
              }
            >
              <ContactMap />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  )
}
