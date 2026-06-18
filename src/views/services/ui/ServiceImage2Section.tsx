import Image from 'next/image'

export function ServiceImage2Section() {
  return (
    <section className="bg-surface-dark py-20">
      <div className="content-container">
        <h2 className="text-[28px] sm:text-[40px] font-semibold text-heading-light leading-[1.10] tracking-[-0.3px] [word-break:keep-all]">
          주방·조리실 공기질개선 시스템
        </h2>
        <div className="mt-8">
          <Image
            src="/images/services/aircok_service_2.png"
            alt="주방·조리실 공기질개선 시스템 AirChef — 에어셰프 구성 및 플랫폼 설명"
            width={1200}
            height={1800}
            style={{ width: '100%', height: 'auto' }}
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>
      </div>
    </section>
  )
}
