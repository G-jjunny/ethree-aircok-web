import Image from 'next/image'
import { connection } from 'next/server'
import { getProductSectionImageListServer } from '@/entities/product-section-image/server'
import { getSlotImage, type ProductSectionImage } from '@/entities/product-section-image'
import { SITE } from '@/shared/config'
import { SectionLabel } from '@/shared/ui'
import { SlotImage } from './SlotImage'

/** 좌상단 브랜드 글로우 — 토큰 var() + color-mix 파생(하드코딩 아님, PageHero radial 과 동일 관행). */
const INDOOR_GLOW =
  'radial-gradient(circle at 40% 40%, color-mix(in oklab, var(--color-brand) 40%, transparent), transparent 62%)'

const COPY = {
  eyebrow: 'SMART AIRCOK SYSTEM',
  title: '실내 공기질 통합 관리 시스템',
  body: '12종의 공기질 지표를 실시간 측정하고, 클라우드에 저장·분석하여 언제 어디서나 모니터링합니다. 측정에서 관리까지 하나의 사이클로 연결됩니다.',
}

/**
 * [실내] 브랜드 스트립 — BRAND_BG_INDOOR 슬롯을 풀블리드 배경으로 깔고 그 위에 로고·타이틀·리드를 얹는다.
 * 슬롯 미등록(현재 기본 상태)이면 dark 줄무늬 폴백이 같은 자리를 채운다.
 */
export async function IndoorBrandSection() {
  // 빌드 타임 프리렌더(백엔드 미기동)에서 fetch가 실행되지 않도록 요청 시점으로 미룬다.
  await connection()

  let images: ProductSectionImage[] = []
  try {
    images = await getProductSectionImageListServer()
  } catch {
    images = []
  }

  const bg = getSlotImage(images, 'BRAND_BG_INDOOR')

  return (
    <section className="relative overflow-hidden bg-navy">
      <SlotImage
        src={bg}
        alt=""
        label="BRAND BG"
        variant="dark"
        bordered={false}
        rounded="rounded-none"
        className="absolute inset-0 h-full w-full"
        sizes="100vw"
      />
      {/* 배경 이미지 위 텍스트 대비 확보용 오버레이 */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-navy-deep/62 via-navy/72 to-navy-tint/86"
      />
      <div
        aria-hidden="true"
        className="absolute -left-35 -top-25 h-130 w-130 rounded-full blur-xl"
        style={{ backgroundImage: INDOOR_GLOW }}
      />

      <div className="relative z-10 content-container flex flex-col items-center gap-5 py-24 text-center">
        <SectionLabel color="cyan">{COPY.eyebrow}</SectionLabel>
        <div className="inline-flex flex-col items-center gap-3.5">
          {/* width/height 는 에셋 고유 크기(200x71). CSS 로 height 만 40px 고정하고
              width:auto 로 종횡비를 유지한다 — 두 값 모두 고유비와 일치해야 next/image
              종횡비 경고가 발생하지 않는다.
              token 없음: 40px 표시 높이. globals.css 의 구 커스텀 스케일이 --spacing-10 을
              120px 로 덮고 있어 h-10 이 40px 이 아니다(Nav=h-7.5/30px, Footer=h-8.5/34px 는
              소수 스텝이라 오염을 피했으나 40px 은 정수 스텝 10 과 정면 충돌). 해당 블록
              제거 후 h-10 w-auto 로 교체할 것. */}
          <Image
            src="/images/logos/logo-white.png"
            alt={SITE.nameEn}
            width={200}
            height={71}
            style={{ width: 'auto', height: '40px' }}
          />
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
