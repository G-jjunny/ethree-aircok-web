import { SITE } from '@/shared/config'
import { ChefLabel } from './ChefLabel'

/**
 * 브랜드 스트립 배경 — design.md §2 chef 계열 radial(chef-dark-tint → chef-dark 62%). 토큰 var() 참조.
 *
 * 배경 이미지와 무관한 순수 장식이다. 스톱 구성은 design.md §2 에 명시된 에어쉴드 recipe 그대로이고,
 * 지오메트리(120% 100% at 20% 0%)만 IndoorBrandSection 과 일치시켰다 — 두 브랜드 스트립은 각 탭의
 * 동일 역할 섹션이므로 골격을 공유하고 색상 계열만 분기한다(design.md §0). 좌상단 앵커는 아래
 * KITCHEN_GLOW 의 코너를 보강한다(KitchenAirshield 의 radial·글로우 동일 코너 규약).
 */
const KITCHEN_BG =
  'radial-gradient(120% 100% at 20% 0%, var(--color-chef-dark-tint), var(--color-chef-dark) 62%)'

/** 좌상단 chef 글로우 — 토큰 var() + color-mix 파생(design Pre 승인: chef/42 반투명). */
const KITCHEN_GLOW =
  'radial-gradient(circle at 40% 40%, color-mix(in oklab, var(--color-chef) 42%, transparent), transparent 62%)'

const COPY = {
  title: '주방·조리실 공기질 개선 시스템',
  body: '조리 과정에서 발생하는 미세먼지·유증기·냄새를 진단하고 개선합니다. 진단부터 개선, 지속 관리까지 주방 특화 솔루션을 제공합니다.',
}

/**
 * [주방] 브랜드 스트립 — chef-dark 배경 위에 AIR CHEF 워드마크를 얹는 정적 섹션.
 * 데이터 의존이 없어 동기 컴포넌트이며 정적 셸에 프리렌더된다(PPR).
 *
 * 대비 규칙(design.md §2): `bg-chef-dark` 섹션이므로 eyebrow 는 chef 가 아니라 chef-soft 를 쓴다.
 */
export function KitchenBrandSection() {
  return (
    <section
      className="relative overflow-hidden bg-chef-dark"
      style={{ backgroundImage: KITCHEN_BG }}
    >
      {/* animate-drift — IndoorBrandSection 과 동일 규약(골격 공유, 계열색만 분기). */}
      <div
        aria-hidden="true"
        className="absolute -left-35 -top-25 h-130 w-130 animate-drift rounded-full blur-xl"
        style={{ backgroundImage: KITCHEN_GLOW }}
      />

      <div className="relative z-10 content-container flex flex-col items-center gap-5 py-24 text-center">
        <ChefLabel tone="chef-soft">{`${SITE.airChef.nameEn} SYSTEM`}</ChefLabel>
        <div className="inline-flex flex-col items-center gap-3">
          <span className="font-display text-4xl sm:text-5xl font-extrabold tracking-headline text-white">
            {SITE.airChef.nameEn}
          </span>
          <h2 className="text-h6 sm:text-h5 font-extrabold tracking-headline text-white">
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
