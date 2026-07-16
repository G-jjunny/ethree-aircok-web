import { connection } from 'next/server'
import { getProductSectionImageListServer } from '@/entities/product-section-image/server'
import { getSlotImage, type ProductSectionImage } from '@/entities/product-section-image'
import { SITE } from '@/shared/config'
import { ChefLabel } from './ChefLabel'
import { SlotImage } from './SlotImage'

/** 좌상단 chef 글로우 — 토큰 var() + color-mix 파생(design Pre 승인: chef/42 반투명). */
const KITCHEN_GLOW =
  'radial-gradient(circle at 40% 40%, color-mix(in oklab, var(--color-chef) 42%, transparent), transparent 62%)'

const COPY = {
  title: '주방·조리실 공기질 개선 시스템',
  body: '조리 과정에서 발생하는 미세먼지·유증기·냄새를 진단하고 개선합니다. 진단부터 개선, 지속 관리까지 주방 특화 솔루션을 제공합니다.',
}

/**
 * [주방] 브랜드 스트립 — BRAND_BG_KITCHEN 슬롯을 풀블리드 배경으로 깔고 AIR CHEF 워드마크를 얹는다.
 *
 * 대비 규칙(design.md §2): `bg-chef-dark` 섹션이므로 eyebrow 는 chef 가 아니라 chef-soft,
 * 배경 슬롯 폴백은 dark 가 아니라 chef-dark variant 를 쓴다(chef-dark 는 자체 배경색이 없어
 * 부모 섹션의 `bg-chef-dark` 가 배경을 제공한다).
 */
export async function KitchenBrandSection() {
  // 빌드 타임 프리렌더(백엔드 미기동)에서 fetch가 실행되지 않도록 요청 시점으로 미룬다.
  await connection()

  let images: ProductSectionImage[] = []
  try {
    images = await getProductSectionImageListServer()
  } catch {
    images = []
  }

  const bg = getSlotImage(images, 'BRAND_BG_KITCHEN')

  return (
    <section className="relative overflow-hidden bg-chef-dark">
      <SlotImage
        src={bg}
        alt=""
        label="BRAND BG"
        variant="chef-dark"
        bordered={false}
        rounded="rounded-none"
        className="absolute inset-0 h-full w-full"
        sizes="100vw"
      />
      {/* 배경 이미지 위 텍스트 대비 확보용 오버레이 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-chef-dark/60 via-chef-dark/72 to-chef-dark/88"
      />
      <div
        aria-hidden="true"
        className="absolute -left-35 -top-25 h-130 w-130 rounded-full blur-xl"
        style={{ backgroundImage: KITCHEN_GLOW }}
      />

      <div className="relative z-10 content-container flex flex-col items-center gap-5 py-24 text-center">
        <ChefLabel tone="chef-soft">{`${SITE.airChef.nameEn} SYSTEM`}</ChefLabel>
        <div className="inline-flex flex-col items-center gap-3">
          <span className="font-display text-5xl font-extrabold tracking-headline text-white">
            {SITE.airChef.nameEn}
          </span>
          <h2 className="text-h5 font-extrabold tracking-headline text-white">
            {COPY.title}
          </h2>
        </div>
        {/* token 없음: max-w-[660px] 중앙 정렬 리드 프로즈 폭(1회성) */}
        <p className="max-w-[660px] text-lead-sm leading-relaxed text-white/72">
          {COPY.body}
        </p>
      </div>
    </section>
  )
}
