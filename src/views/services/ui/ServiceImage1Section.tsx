import Image from 'next/image'

export function ServiceImage1Section() {
  return (
    <section className="bg-surface-light py-20">
      <div className="content-container">
        <h2 className="text-[28px] sm:text-[40px] font-semibold text-heading-dark leading-[1.10] tracking-[-0.3px] [word-break:keep-all]">
          실내공기질관리 시스템
        </h2>
        <div className="mt-8">
          <Image
            src="/images/services/aircok_service_1.png"
            alt="실내공기질관리 시스템 — 스마트에어콕 시스템 구성도 및 제품 스펙"
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
