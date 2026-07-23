import { connection } from 'next/server'
import { getCertificationListServer } from '@/entities/certification/server'
import type { Certification } from '@/entities/certification'
import { SectionLabel } from '@/shared/ui'
import { CertGalleryItem } from './CertGalleryItem'

const COPY = {
  eyebrow: 'PATENTS & CERTIFICATIONS',
  title: '공기를 잘 아는, 공기를 잘 보는 에어콕',
  body: '기술력은 숫자로 증명됩니다. 핵심 특허와 국가 성능인증이 진단의 정확성을 뒷받침합니다.',
  galleryLabel: '인증서 · 특허증',
} as const

const STAT_CARDS = [
  {
    value: '12',
    unit: '건',
    title: '핵심 특허등록',
    desc: '측정·분석·모니터링 전반의 독자 기술',
  },
  {
    value: '4',
    unit: '건',
    title: '측정기 성능인증 1등급',
    desc: '한국건설생활환경시험연구원(KCL)',
  },
  {
    value: '1',
    unit: '건',
    title: '조달 혁신제품 지정',
    desc: '조달청 혁신제품 지정 인증',
  },
] as const

/**
 * 특허 및 성능 인증 — **async 서버 컴포넌트**(데이터).
 *
 * 통계 3카드는 항상 렌더(정적). 갤러리는 certification 서버 페처로 조회하며, 목록이 비면
 * 갤러리 영역을 숨긴다(통계 카드만 유지). 갤러리 셀은 클라이언트 leaf(CertGalleryItem)로
 * 라이트박스 확대를 제공한다.
 */
export async function ServiceCertsSection() {
  await connection()

  let certifications: Certification[] = []
  try {
    certifications = await getCertificationListServer()
  } catch {
    certifications = []
  }

  return (
    <section className="bg-surface-white py-24">
      <div className="content-container">
        <div className="flex flex-col items-center text-center">
          <SectionLabel color="brand">{COPY.eyebrow}</SectionLabel>
          <h2 className="mt-3 text-h5 font-extrabold tracking-headline text-ink">
            {COPY.title}
          </h2>
          {/* token 없음: max-w-[560px] 섹션 리드 프로즈 폭(1회성) */}
          <p className="mt-3.5 max-w-[560px] text-lead-sm leading-relaxed text-muted">
            {COPY.body}
          </p>
        </div>

        {/* 통계 3카드 — 항상 렌더 */}
        <div className="mt-12 grid grid-cols-1 gap-5.5 sm:grid-cols-3">
          {STAT_CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-card border border-tint-border bg-tint px-7.5 py-9.5 text-center"
            >
              <div className="font-display text-h3 font-extrabold leading-none text-brand">
                {card.value}
                <span className="text-2xl">{card.unit}</span>
              </div>
              <div className="mt-3 text-base font-extrabold text-ink">
                {card.title}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* 인증서 갤러리 — 목록이 있을 때만 */}
        {certifications.length > 0 && (
          <div className="mt-5.5 rounded-card border border-hairline bg-surface p-7.5">
            <div className="mb-4 text-sm font-bold text-muted">
              {COPY.galleryLabel}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {certifications.map((cert, index) => (
                <CertGalleryItem
                  key={cert.id}
                  src={cert.imageUrl}
                  alt={`${COPY.galleryLabel} ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
