import { Check, X } from 'lucide-react'
import { connection } from 'next/server'
import { getProductSectionImageListServer } from '@/entities/product-section-image/server'
import { getSlotImage } from '@/entities/product-section-image'
import type { ProductSectionImage } from '@/entities/product-section-image'
import { SlotImage } from './SlotImage'

const COPY = {
  badge: '에어콕 도입으로 달라지는 것들',
  title: '당신 주변의 공기, 이제 보면서 관리하세요',
} as const

const BEFORE = {
  en: 'BEFORE',
  title: ['공기 오염 정보 없이', '단순 공기정화장치만 가동'],
  items: [
    '실내 공간 공기질 상태 확인 불가',
    '갑작스러운 공기 오염에 대처 불가',
    '환기·정화 등 수동적·미온적 대처',
    '정화장치 작동·개선 정도 확인 불가능',
    '직원 건강 저하 및 업무 효율성 하락',
  ],
} as const

const AFTER = {
  en: 'AFTER',
  title: ['공기 오염 정보를 확인하며', '공기정화장치를 가동'],
  items: [
    '실내 공간 공기질 상태 실시간 확인',
    '공기 오염에 대한 경고 알람 제공',
    '지속 정보·알람으로 적절한 정화 시점 대응',
    '정화 상태 확인 및 개선 효율성 향상',
    '직원 건강 향상 및 업무 효율 증대',
  ],
} as const

// 다크 radial (좌상단 기점) — 토큰 var() 참조, 하드코딩 아님
const COMPARE_RADIAL =
  'radial-gradient(120% 100% at 20% 0%, var(--color-navy-tint), var(--color-navy) 60%, var(--color-navy-deep) 100%)'

/**
 * 서비스 전후 비교(BEFORE / AFTER) — **async 서버 컴포넌트**(데이터).
 *
 * product-section-image 서버 페처로 비교 슬롯 이미지를 조회한다(미등록이면 SlotImage 폴백).
 * BEFORE는 grayscale, AFTER는 brand 강조. 체크/엑스 리스트는 정적.
 */
export async function ServiceCompareSection() {
  await connection()

  let images: ProductSectionImage[] = []
  try {
    images = await getProductSectionImageListServer()
  } catch {
    images = []
  }

  const beforeSrc = getSlotImage(images, 'DIAGNOSIS_COMPARE_BEFORE')
  const afterSrc = getSlotImage(images, 'DIAGNOSIS_COMPARE_AFTER')

  return (
    <section
      className="relative overflow-hidden bg-navy py-24 text-white"
      style={{ backgroundImage: COMPARE_RADIAL }}
    >
      <div className="content-container">
        <div className="flex flex-col items-center text-center">
          <span className="inline-block rounded-pill border border-brand/40 bg-brand/18 px-4.5 py-2 text-sm font-bold text-brand-soft">
            {COPY.badge}
          </span>
          <h2 className="mt-4.5 text-h5 font-extrabold tracking-headline">
            {COPY.title}
          </h2>
        </div>

        <div className="mt-13 grid grid-cols-1 items-stretch gap-6.5 lg:grid-cols-2">
          {/* BEFORE */}
          <div className="flex flex-col overflow-hidden rounded-card-lg border border-white/10 bg-white/4">
            <div className="px-7.5 pt-6.5 pb-5.5">
              <div className="font-display text-xs font-bold uppercase tracking-caption text-white/50">
                {BEFORE.en}
              </div>
              <h3 className="mt-2 text-xl font-extrabold text-white/90">
                {BEFORE.title[0]}
                <br />
                {BEFORE.title[1]}
              </h3>
            </div>
            <div className="mx-7.5 grayscale">
              <SlotImage
                src={beforeSrc}
                alt="관리 전 사무실"
                label="BEFORE"
                variant="dark"
                rounded="rounded-image"
                className="aspect-[16/10] w-full"
                sizes="(min-width: 1024px) 560px, 100vw"
              />
            </div>
            <ul className="flex flex-col gap-3 px-7.5 pt-6.5 pb-8.5">
              {BEFORE.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-white/72"
                >
                  <X className="mt-0.5 size-4 shrink-0 text-error" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* AFTER */}
          <div className="flex flex-col overflow-hidden rounded-card-lg border border-brand/50 bg-brand/8 shadow-brand">
            <div className="px-7.5 pt-6.5 pb-5.5">
              <div className="font-display text-xs font-bold uppercase tracking-caption text-cyan">
                {AFTER.en}
              </div>
              <h3 className="mt-2 text-xl font-extrabold">
                {AFTER.title[0]}
                <br />
                {AFTER.title[1]}
              </h3>
            </div>
            <div className="mx-7.5">
              <SlotImage
                src={afterSrc}
                alt="관리 후 사무실"
                label="AFTER"
                variant="dark"
                rounded="rounded-image"
                className="aspect-[16/10] w-full"
                sizes="(min-width: 1024px) 560px, 100vw"
              />
            </div>
            <ul className="flex flex-col gap-3 px-7.5 pt-6.5 pb-8.5">
              {AFTER.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm leading-relaxed text-white"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-cyan" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
