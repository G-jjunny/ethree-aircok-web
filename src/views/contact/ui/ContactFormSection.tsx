import { SectionHeader } from '@/shared/ui'
import { InquiryForm } from '@/features/inquiry-form'

export function ContactFormSection() {
  return (
    <section className="bg-surface-white py-20">
      <div className="content-container">
        <SectionHeader
          label="문의하기"
          title="온라인으로 문의하기"
          theme="light"
          titleAs="h2"
          align="center"
        />
        {/* max-w-[640px]: 폼 최적 가독 너비, 1회성 레이아웃 수치 — 토큰 없음 */}
        <div className="max-w-[640px] mx-auto mt-12">
          <InquiryForm />
        </div>
      </div>
    </section>
  )
}
