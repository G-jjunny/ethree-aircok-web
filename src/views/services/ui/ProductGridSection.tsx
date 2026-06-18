import Image from 'next/image'

export function ProductGridSection() {
  return (
    <section className="bg-surface-light py-20">
      <div className="content-container">
        <h2 className="text-[40px] font-semibold text-heading-dark leading-[1.10] tracking-[-0.3px] [word-break:keep-all]">
          제품 라인업
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {/* 제품 카드 1: 실내 공기질 측정기 */}
          <div className="bg-surface-white rounded-lg overflow-hidden shadow-card">
            <div className="relative aspect-[4/3]">
              {/* 제품 이미지 1: 실내 공기질 측정기 SA-IL2 */}
              <Image
                src="/images/services/product-1.jpg"
                alt="에어콕 실내 공기질 측정기 SA-IL2"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-[21px] font-bold text-heading-dark leading-[1.19]">실내 공기질 측정기</h3>
              <p className="text-[17px] text-body-dark leading-[1.65] [word-break:keep-all] mt-3">
                미세먼지·CO₂·온습도 등 8가지 항목을 실시간 측정합니다.
              </p>
            </div>
          </div>

          {/* 제품 카드 2: 에어셰프 주방 공기질 측정기 */}
          <div className="bg-surface-white rounded-lg overflow-hidden shadow-card">
            <div className="relative aspect-[4/3]">
              {/* 제품 이미지 2: 에어셰프 주방·조리실 전용 측정기 */}
              <Image
                src="/images/services/product-2.jpg"
                alt="에어콕 에어셰프 주방 공기질 측정기"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-[21px] font-bold text-heading-dark leading-[1.19]">에어셰프 — 주방·조리실 전용</h3>
              <p className="text-[17px] text-body-dark leading-[1.65] [word-break:keep-all] mt-3">
                조리흄·조리연기 등 주방 특화 유해물질을 모니터링합니다.
              </p>
            </div>
          </div>

          {/* 제품 카드 3: 클라우드 모니터링 플랫폼 */}
          <div className="bg-surface-white rounded-lg overflow-hidden shadow-card">
            <div className="relative aspect-[4/3]">
              {/* 제품 이미지 3: 클라우드 모니터링 시스템 */}
              <Image
                src="/images/services/product-3.jpg"
                alt="에어콕 공기질 클라우드 모니터링 시스템"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-[21px] font-bold text-heading-dark leading-[1.19]">클라우드 모니터링 플랫폼</h3>
              <p className="text-[17px] text-body-dark leading-[1.65] [word-break:keep-all] mt-3">
                측정 데이터를 실시간으로 시각화하고 분석 레포트를 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
