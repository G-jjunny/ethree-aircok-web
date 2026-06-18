import Image from 'next/image'

export function ProductsIntroSection() {
  return (
    <section className="bg-surface-white py-12">
      <div className="content-container">
        {/* token 없음: 제품 소개 이미지 단독 표시를 위한 1회성 최대 너비 수치 */}
        <div className="max-w-[780px] mx-auto">
          <Image
            src="/images/services/aircok_products.png"
            alt="스마트에어콕 제품 라인업 소개"
            width={780}
            height={520}
            style={{ width: '100%', height: 'auto' }}
            sizes="(max-width: 780px) 100vw, 780px"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  )
}
