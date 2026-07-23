import { connection } from 'next/server'
import { getProductSectionImageListServer } from '@/entities/product-section-image/server'
import {
  toSlotImageMap,
  type ProductSectionImage,
  type ProductSectionImageMap,
} from '@/entities/product-section-image'
import { ChefLabel } from './ChefLabel'
import { SlotImage } from './SlotImage'

const COPY = {
  eyebrow: 'AIR CHEF BLACKBOX',
  title: '에어셰프 블랙박스',
  /** h2 뒤에 붙는 작은 muted 서브 타이틀. */
  subtitle: '· 공기질 진단관리',
  body: '조리실에 설치해 공기질을 24시간 기록·관리하는 진단 장치. 실시간 관리 인터페이스와 진단 보고서를 제공합니다.',
  model: 'AIR CHEF BLACKBOX',
  badge: '실시간 진단',
  didTitle: '조리실 오염 현황 DID',
}

/** 제품 카드 하단 스펙 2칸. */
const SPECS: { label: string; value: string }[] = [
  { label: '측정 항목', value: '유증기·미세먼지·온습도' },
  { label: '기록', value: '24시간 상시 로깅' },
]

/**
 * [주방] 에어셰프 블랙박스 — 좌 제품 카드 / 우 조리실 오염 현황 DID.
 *
 * 라이트(surface-white) 섹션이므로 eyebrow 는 chef 톤, 슬롯 폴백은 `chef` variant 를 쓴다
 * (design.md §2 대비 규칙: 라이트 배경 위 강조 = chef).
 * 제품 사진은 시안상 정적 placeholder 였으나 **관리자 슬롯으로 승격**되었다(사용자 결정) —
 * 슬롯 미등록이 정상 케이스라 기본 렌더 경로는 SlotImage 폴백이다.
 * 슬롯 이미지는 KitchenDiagnosisSection 과 동일하게 서버에서 한 번만 조회해 정규화한다.
 */
export async function KitchenBlackboxSection() {
  // 빌드 타임 프리렌더(백엔드 미기동)에서 fetch가 실행되지 않도록 요청 시점으로 미룬다.
  await connection()

  let images: ProductSectionImage[] = []
  try {
    images = await getProductSectionImageListServer()
  } catch {
    images = []
  }

  const slotImages: ProductSectionImageMap = toSlotImageMap(images)

  return (
    <section className="bg-surface-white py-24">
      <div className="content-container">
        <ChefLabel>{COPY.eyebrow}</ChefLabel>
        <h2 className="mt-3 text-h6 sm:text-h5 font-extrabold tracking-headline text-ink">
          {COPY.title}{' '}
          <span className="text-lg font-semibold text-muted">{COPY.subtitle}</span>
        </h2>
        {/* token 없음: max-w-[640px] 섹션 리드 프로즈 폭(1회성) */}
        <p className="mt-3 max-w-[640px] text-lead-sm leading-relaxed text-muted">
          {COPY.body}
        </p>

        {/* 시안 데스크톱 비율 .9fr 1.1fr — 모바일은 1컬럼 스택. */}
        <div className="mt-11 grid items-stretch gap-11 lg:grid-cols-[0.9fr_1.1fr]">
          {/* 좌: 제품 카드 — 카드 호버 표준(리프트 + 그림자 + chef 계열 보더 강조).
              큰 패널이라 shadow-float 는 과해 shadow-card 로 억제한다. */}
          <div className="flex flex-col rounded-card-lg border border-hairline bg-surface p-6 transition-all duration-fast ease-out hover:-translate-y-1 hover:border-chef-tint-border hover:shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <ChefLabel size="sm">MODEL</ChefLabel>
                <div className="mt-1.5 text-xl font-extrabold text-ink">{COPY.model}</div>
              </div>
              <span className="shrink-0 rounded-pill border border-chef-tint-border bg-chef-tint px-3 py-1.5 text-mini font-bold text-chef-hover">
                {COPY.badge}
              </span>
            </div>

            <SlotImage
              src={slotImages.KITCHEN_BLACKBOX_PRODUCT}
              alt={`${COPY.model} 제품 사진`}
              label="BLACKBOX"
              variant="chef"
              rounded="rounded-image"
              className="mt-5 min-h-60 flex-1"
              sizes="(min-width: 1024px) 420px, 100vw"
            />

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SPECS.map((spec) => (
                <div
                  key={spec.label}
                  className="rounded-btn border border-hairline bg-surface-white px-4 py-3.5"
                >
                  <div className="text-mini text-muted">{spec.label}</div>
                  <div className="mt-1 text-sm font-bold text-ink">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 우: 조리실 오염 현황 DID — 다크 크롬바 + 화면 슬롯.
              IndoorCloud 의 스크린 목업과 동일 레시피(계열색만 chef 로 분기). */}
          <div className="flex flex-col overflow-hidden rounded-image border border-hairline shadow-card transition-all duration-fast ease-out hover:-translate-y-1 hover:border-chef-tint-border hover:shadow-float">
            <div className="flex items-center gap-2 bg-navy px-4.5 py-3">
              <span className="size-2.5 rounded-full bg-aqi-good" />
              <span className="font-display text-mini text-white/60">{COPY.didTitle}</span>
            </div>
            <SlotImage
              src={slotImages.KITCHEN_BLACKBOX_DID}
              alt={COPY.didTitle}
              label="DID"
              variant="chef"
              rounded="rounded-none"
              bordered={false}
              className="min-h-80 flex-1"
              sizes="(min-width: 1024px) 640px, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
