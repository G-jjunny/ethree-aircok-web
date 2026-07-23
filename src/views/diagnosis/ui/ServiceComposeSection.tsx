import { connection } from 'next/server'
import { getProductSectionImageListServer } from '@/entities/product-section-image/server'
import { getSlotImage } from '@/entities/product-section-image'
import type { ProductSectionImage } from '@/entities/product-section-image'
import { SectionLabel } from '@/shared/ui'
import { SlotImage } from './SlotImage'

const COPY = {
  eyebrow: 'COMPOSITION & ITEMS',
  title: '에어콕 구성 및 측정 항목',
  itemsTitle: '측정 항목',
  notesTitle: '이용 안내',
} as const

const COMPOSE_BLOCKS = [
  {
    slot: 'DIAGNOSIS_COMPOSE_DEVICE' as const,
    title: '실내공기질 측정기',
    desc: 'LTE 통신 개통된 제품으로 제공되는 진단 전용 측정기',
    label: 'DEVICE',
    alt: '실내공기질 측정기',
  },
  {
    slot: 'DIAGNOSIS_COMPOSE_MONITOR' as const,
    title: '공기오염 모니터링 서비스',
    desc: '웹 버전으로 제공되는 실시간 모니터링 대시보드',
    label: 'MONITOR',
    alt: '공기오염 모니터링 서비스',
  },
] as const

const MEASURED_ITEMS = [
  { code: 'PM10', ko: '미세먼지', tone: 'brand' },
  { code: 'PM2.5', ko: '초미세먼지', tone: 'brand' },
  { code: 'Temp', ko: '온도', tone: 'cyan' },
  { code: 'Hum', ko: '습도', tone: 'cyan' },
  { code: 'CO₂', ko: '이산화탄소', tone: 'brand' },
] as const

const NOTES = [
  '진단 서비스 측정기는 LTE 통신 개통된 제품으로 제공됩니다.',
  '미세먼지·이산화탄소 성능인증 1등급을 획득한 모델입니다.',
  '측정 장소·대류 형태·시설 구조 등에 따라 편차가 발생할 수 있습니다.',
  '측정기는 가급적 설치 위치를 옮기거나 만지지 말아 주세요.',
  '실내 측정용으로, 실외 사용 및 물 접촉을 피해 주세요.',
  '전원·네트워크·센서 이상 시 에어콕에 상담해 주시면 안내해 드립니다.',
] as const

/**
 * 구성 및 측정 항목 — **async 서버 컴포넌트**(데이터).
 *
 * product-section-image 서버 페처로 구성 슬롯 이미지를 조회한다(미등록이면 SlotImage 폴백).
 * Compare 섹션과 별도 호출이지만 'use cache' 래퍼라 요청 스코프에서 dedupe 된다.
 * 측정항목 5뱃지·이용안내 6불릿은 정적.
 */
export async function ServiceComposeSection() {
  await connection()

  let images: ProductSectionImage[] = []
  try {
    images = await getProductSectionImageListServer()
  } catch {
    images = []
  }

  return (
    <section className="bg-surface py-24">
      <div className="content-container">
        <div className="flex flex-col items-center text-center">
          <SectionLabel color="brand">{COPY.eyebrow}</SectionLabel>
          <h2 className="mt-3 text-h5 font-extrabold tracking-headline text-ink">
            {COPY.title}
          </h2>
        </div>

        {/* 구성 2블록 */}
        <div className="mt-13 grid grid-cols-1 gap-9.5 lg:grid-cols-2">
          {COMPOSE_BLOCKS.map((block) => (
            <div key={block.slot} className="flex flex-col">
              <div className="text-lg font-extrabold text-ink">
                {block.title}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {block.desc}
              </p>
              <SlotImage
                src={getSlotImage(images, block.slot)}
                alt={block.alt}
                label={block.label}
                variant="surface"
                rounded="rounded-image"
                className="mt-5.5 aspect-[16/10] w-full"
                sizes="(min-width: 1024px) 560px, 100vw"
              />
            </div>
          ))}
        </div>

        {/* 측정 항목 5뱃지 */}
        <div className="mt-6.5 rounded-card border border-hairline bg-surface-white px-5 py-7 sm:px-8.5 sm:py-9.5">
          <div className="text-center text-lg font-extrabold text-ink">
            {COPY.itemsTitle}
          </div>
          <div className="mt-7.5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {MEASURED_ITEMS.map((item) => (
              <div
                key={item.code}
                className="flex flex-col items-center gap-3"
              >
                <div
                  className={`flex size-21 items-center justify-center rounded-full border ${
                    item.tone === 'cyan'
                      ? 'border-cyan/25 bg-cyan/10'
                      : 'border-tint-border bg-tint'
                  }`}
                >
                  <span
                    className={`font-display text-base font-extrabold ${
                      item.tone === 'cyan' ? 'text-cyan-hover' : 'text-brand'
                    }`}
                  >
                    {item.code}
                  </span>
                </div>
                <div className="text-sm font-bold text-ink">{item.ko}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 이용 안내 6불릿 */}
        <div className="mt-5.5 rounded-image border border-hairline bg-tint px-5 py-6 sm:px-8.5 sm:py-7.5">
          <div className="mb-3.5 text-sm font-bold text-ink">
            {COPY.notesTitle}
          </div>
          <ul className="grid grid-cols-1 gap-x-8.5 gap-y-2.5 sm:grid-cols-2">
            {NOTES.map((note) => (
              <li
                key={note}
                className="flex gap-2 text-sm leading-relaxed text-muted"
              >
                <span className="shrink-0 text-brand">•</span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
