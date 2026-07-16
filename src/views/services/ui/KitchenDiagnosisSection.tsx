import { connection } from 'next/server'
import { getProductSectionImageListServer } from '@/entities/product-section-image/server'
import {
  toSlotImageMap,
  type ProductImageSlot,
  type ProductSectionImage,
  type ProductSectionImageMap,
} from '@/entities/product-section-image'
import { ChefLabel } from './ChefLabel'
import { SlotImage } from './SlotImage'

const COPY = {
  eyebrow: 'DIAGNOSIS SERVICE',
  title: '공기질 진단 서비스',
  body: '전문 인력이 현장을 방문해 조리실 공기질을 측정하고, 개선 방향을 담은 진단 리포트를 제공합니다.',
}

/** 4카드 정적 콘텐츠. 이미지만 슬롯(API)에서 온다. */
const CARDS: {
  slot: ProductImageSlot
  /** 카드 eyebrow(예: '01 · 현장 방문'). */
  step: string
  title: string
  body: string
  /** 폴백 placeholder 라벨(짧은 영문 슬롯명). */
  label: string
}[] = [
  {
    slot: 'DIAGNOSIS_VISIT',
    step: '01 · 현장 방문',
    title: '주방 환경 측정',
    body: '조리 시간대 공기질을 측정하고 주방 환경을 점검합니다.',
    label: 'VISIT',
  },
  {
    slot: 'DIAGNOSIS_ANALYSIS',
    step: '02 · 분석',
    title: '풍속측정',
    body: '측정 데이터로 유증기·미세먼지 발생 패턴을 분석합니다.',
    label: 'ANALYSIS',
  },
  {
    slot: 'DIAGNOSIS_REPORT',
    step: '03 · 리포트',
    title: '후드/팬 규격측정',
    body: '현황과 개선 방향을 담은 맞춤 진단 리포트를 전달합니다.',
    label: 'REPORT',
  },
  {
    slot: 'DIAGNOSIS_PROPOSAL',
    step: '04 · 제안',
    title: '실시간 공기질측정',
    body: '공간 규모에 맞는 에어쉴드 구성과 관리 방안을 제안합니다.',
    label: 'PROPOSAL',
  },
]

/**
 * [주방] 공기질 진단 서비스 — 4카드 그리드.
 *
 * 라이트(surface) 섹션이므로 카드 썸네일 폴백은 `chef` variant(연청록 줄무늬)를 쓴다
 * (design Pre 확정: `<PagePlaceholder variant="chef" label="VISIT" className="aspect-card w-full" />`).
 * 슬롯 이미지는 서버에서 한 번만 조회해 `toSlotImageMap` 으로 정규화한다.
 */
export async function KitchenDiagnosisSection() {
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
    <section className="bg-surface py-24">
      <div className="content-container">
        <ChefLabel>{COPY.eyebrow}</ChefLabel>
        <h2 className="mt-3 text-h5 font-extrabold tracking-headline text-ink">
          {COPY.title}
        </h2>
        {/* token 없음: max-w-[640px] 섹션 리드 프로즈 폭(1회성) */}
        <p className="mt-3 max-w-[640px] text-lead-sm leading-relaxed text-muted">
          {COPY.body}
        </p>

        <ul className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((card) => (
            <li
              key={card.slot}
              className="overflow-hidden rounded-image border border-hairline bg-surface-white shadow-card"
            >
              <SlotImage
                src={slotImages[card.slot]}
                alt={card.title}
                label={card.label}
                variant="chef"
                rounded="rounded-none"
                bordered={false}
                className="aspect-card w-full"
                sizes="(min-width: 1024px) 290px, (min-width: 640px) 50vw, 100vw"
              />
              <div className="p-5">
                <div className="font-display text-eyebrow font-bold text-chef">
                  {card.step}
                </div>
                <h3 className="mt-2 text-base font-extrabold text-ink">{card.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{card.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
