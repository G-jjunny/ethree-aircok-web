import Image from 'next/image'

const SLIDES = [
  {
    src: '/images/diagnosis/slide-01.png',
    alt: '지금 여기!! 공기는 안전할까? — 5일 완벽 분석 스마트에어콕 진단서비스 소개',
  },
  {
    src: '/images/diagnosis/slide-02.png',
    alt: '공기 걱정 채팅 시나리오 — 에어콕 서비스 소개 메시지',
  },
  {
    src: '/images/diagnosis/slide-03.png',
    alt: '에어콕 챗 UI — 공기정화장치 필요성 설명',
  },
  {
    src: '/images/diagnosis/slide-04.png',
    alt: '이런 분들은 꼭 이용하세요 — 9가지 공간 유형 아이콘 그리드',
  },
  {
    src: '/images/diagnosis/slide-05.png',
    alt: '공기오염 걱정? 에어콕이 꼭(COK) 찝어드립니다 — 3가지 서비스 특장점',
  },
  {
    src: '/images/diagnosis/slide-06.png',
    alt: '에어콕이 건강한 삶을 만들어드립니다 — 6인 페르소나 카드',
  },
  {
    src: '/images/diagnosis/slide-07.png',
    alt: '에어콕 도입으로 달라지는 것들!! — 도입 전/후 비교표',
  },
  {
    src: '/images/diagnosis/slide-08.png',
    alt: '공기질관리 전문기업 에어콕 연혁 — History 2018~2024',
  },
  {
    src: '/images/diagnosis/slide-09.png',
    alt: '믿을 수 있는 해외 인증 현황 — 특허 12건, 성능인증 4건',
  },
  {
    src: '/images/diagnosis/slide-10.png',
    alt: '에어콕 구성 및 측정 항목 — 하드웨어/서비스 구성도 + 측정항목',
  },
  {
    src: '/images/diagnosis/slide-11.png',
    alt: '10만원! 5일! 투자로 공기질 안심 진단 끝!! — CTA',
  },
  {
    src: '/images/diagnosis/slide-12.png',
    alt: '공기질 안심진단 서비스 신청 및 이용방법 — 4단계 프로세스 + 서비스 신청하기',
  },
]

export function DiagnosisImageSection() {
  return (
    <section className="bg-surface-white py-20">
      {/* token 없음: 780px는 세로형 슬라이드 가독성을 위한 1회성 콘텐츠 폭 제한 */}
      <div className="mx-auto w-full max-w-[780px] px-5">
        <div className="flex flex-col gap-0">
          {SLIDES.map((slide, index) => (
            <div key={slide.src} className="w-full">
              <Image
                src={slide.src}
                alt={slide.alt}
                width={780}
                height={1102} /* token 없음: 세로형 슬라이드 기본 비율(약 1:1.41) 대응 */
                className="w-full h-auto object-contain"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
