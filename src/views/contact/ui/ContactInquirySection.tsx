import { SectionHeader } from '@/shared/ui'
import { SITE } from '@/shared/config'
import { InquiryForm } from '@/features/inquiry-form'

export function ContactInquirySection() {
  // Embed API 키 불필요한 일반 Google Maps 임베드 (output=embed)
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    SITE.contact.address,
  )}&output=embed`

  return (
    <section className="bg-surface-light py-20">
      <div className="content-container">
        <SectionHeader
          label="문의하기"
          title="온라인으로 문의하기"
          theme="light"
          titleAs="h2"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch mt-10">
          {/* 폼 카드(좌측) */}
          {/* max-w-[640px]: lg 미만에서 폼 카드 가독 폭 제한, 1회성 레이아웃 수치 — 토큰 없음 */}
          <div className="bg-surface-white rounded-xl shadow-card p-6 sm:p-8 max-w-[640px] mx-auto lg:max-w-none lg:mx-0 w-full">
            <InquiryForm />
          </div>
          {/* 지도 카드(우측) */}
          {/* min-h-[360px]: 지도 최소 노출 높이, 1회성 레이아웃 수치 — 토큰 없음 */}
          <div className="bg-surface-white rounded-xl shadow-card overflow-hidden h-full min-h-[360px]">
            <iframe
              title={`${SITE.name} 본사 위치 지도`}
              src={mapSrc}
              loading="lazy"
              className="w-full h-full border-none"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
