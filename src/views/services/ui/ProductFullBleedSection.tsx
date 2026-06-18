import Image from 'next/image'

export function ProductFullBleedSection() {
  return (
    <section className="bg-surface-dark py-20">
      <div className="content-container">
        <h2 className="text-[40px] font-semibold text-heading-light leading-[1.10] tracking-[-0.3px] [word-break:keep-all]">
          기술력을 담은 제품
        </h2>
        {/* max-w-[640px]: 본문 최적 읽기 너비 — design.md "Page Sub-Hero" 참조 */}
        <p className="text-[17px] text-body-light leading-[1.65] [word-break:keep-all] mt-4 max-w-[640px]">
          에어콕의 독자적인 광산란 측정 기술과 AI 기반 데이터 분석이 결합된 제품군입니다.
        </p>
        {/* aspect-[16/7]: 풀블리드 히어로 이미지 시네마틱 비율 — 16:9보다 가로로 넓어 제품 전경 강조 */}
        <div className="mt-12 relative w-full aspect-[16/7] rounded-xl overflow-hidden">
          {/* 제품 히어로 이미지: 에어콕 제품 전체 라인업 전경 */}
          <Image
            src="/images/services/hero-1.jpg"
            alt="에어콕 공기질 관리 제품 라인업 전경"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  )
}
