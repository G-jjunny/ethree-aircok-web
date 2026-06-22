import { SITE } from '@/shared/config'

export function ContactMapSection() {
  // Embed API 키 불필요한 일반 Google Maps 임베드 (output=embed)
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    SITE.contact.address,
  )}&output=embed`

  return (
    <section className="bg-surface-light py-20">
      <div className="content-container">
        {/* aspect-video(16/9): 지도 임베드 비율 — design.md §4 표준 카드 비율 토큰 재활용 */}
        <div className="rounded-xl overflow-hidden border border-border-light aspect-video">
          <iframe
            title={`${SITE.name} 본사 위치 지도`}
            src={mapSrc}
            loading="lazy"
            className="w-full h-full border-none"
          />
        </div>
      </div>
    </section>
  )
}
