import type { ReactNode } from 'react'

/**
 * 이미지 자산 미확보 자리를 채우는 표준 줄무늬 플레이스홀더.
 *
 * 시각 표준(design.md §4 stripes): -45deg 대각선 repeating-linear-gradient.
 *  - variant 'surface'   → `stripes-surface`(회색계, hairline 라인)
 *  - variant 'tint'      → `stripes-tint`(연블루계, tint-border 라인)
 *  - variant 'dark'      → `stripes-dark`(네이비 섹션 위 흰색 반투명 라인)
 *  - variant 'chef'      → `stripes-chef`(연청록계, chef-tint-border 라인) — AIR CHEF 라이트 카드
 *  - variant 'chef-dark' → `stripes-dark` 재사용 + chef 톤 라벨/보더 — `bg-chef-dark` 섹션 위
 * 라벨은 항상 `font-display`(Sora) eyebrow 로 표기한다.
 *
 * AIR CHEF(주방) 계열 규칙 — design.md §2:
 *  - 계열 분리: chef 계열은 `/services` 주방 탭 내부에서만. 실내 공기질 섹션은 surface/tint/dark 를 쓴다.
 *  - 대비: `chef-dark` 위 eyebrow·라벨은 `chef` 가 아니라 `chef-soft`. 그래서 'chef-dark' 는
 *    'dark'(text-white/40) 와 별도 variant 로 존재한다 — 주방 다크 섹션에서 'dark' 를 쓰면
 *    eyebrow 가 흰색으로 렌더되어 이 규칙을 어기게 된다.
 *  - 'chef-dark' 의 줄무늬는 `stripes-dark`(흰색 반투명 라인)를 그대로 재사용한다. 라인이
 *    계열 중립(white opacity)이고 배경색은 섹션의 `bg-chef-dark` 가 제공하므로 별도 유틸이 불필요하다.
 *
 * 크기·비율(aspect)은 className 으로, 라운드는 rounded prop 으로 주입한다
 * (base 에 rounded 를 박지 않아 rounded-* 클래스 충돌을 방지).
 *
 * 뉴스 coverImage 폴백(NewsCard)·About 이미지 자리·/services 슬롯 폴백 등에서 공용으로 재사용한다.
 */
export type PagePlaceholderVariant = 'surface' | 'tint' | 'dark' | 'chef' | 'chef-dark'

interface PagePlaceholderProps {
  /**
   * 줄무늬 톤. 라이트 섹션=surface/tint, 다크(네이비) 섹션=dark.
   * AIR CHEF(주방) 탭 전용: 라이트 카드=chef, `bg-chef-dark` 섹션 위=chef-dark. 기본 'surface'.
   */
  variant?: PagePlaceholderVariant
  /** 줄무늬 위 중앙 eyebrow 라벨. children 미지정 시 렌더. */
  label?: string
  /** 라운드 토큰 클래스. 기본 'rounded-card'. 예: 'rounded-none' · 'rounded-btn' · 'rounded-card-lg'. */
  rounded?: string
  /** 테두리 표시 여부. 기본 true. 카드 내부 등에서 불필요하면 false. */
  bordered?: boolean
  /** 크기·비율 등 레이아웃 클래스(예: 'aspect-card w-full' · 'h-full w-full'). */
  className?: string
  children?: ReactNode
}

const STRIPE: Record<PagePlaceholderVariant, string> = {
  surface: 'stripes-surface',
  tint: 'stripes-tint',
  dark: 'stripes-dark',
  chef: 'stripes-chef',
  // 흰색 반투명 라인은 계열 중립 — 배경색은 섹션의 bg-chef-dark 가 제공한다.
  'chef-dark': 'stripes-dark',
}

const BORDER: Record<PagePlaceholderVariant, string> = {
  surface: 'border border-hairline',
  tint: 'border border-tint-border',
  dark: 'border border-white/8',
  chef: 'border border-chef-tint-border',
  // design.md §2 chef 반투명 보더(기본 토큰 + opacity). 풀블리드 배경 슬롯은 bordered={false}.
  'chef-dark': 'border border-chef-soft/35',
}

const LABEL_TONE: Record<PagePlaceholderVariant, string> = {
  surface: 'text-faint',
  tint: 'text-faint',
  dark: 'text-white/40',
  // 라이트 variant 는 톤 통일 — 플레이스홀더 라벨은 의도적으로 저채도 뉴트럴.
  chef: 'text-faint',
  // chef-dark 위 eyebrow 는 chef-soft(design.md §2 대비 규칙). /60 은 dark 의 white/40 과
  // 지각 밝기를 맞춘 값 — 라벨이 실제 콘텐츠처럼 보이지 않게 억제한다.
  'chef-dark': 'text-chef-soft/60',
}

export function PagePlaceholder({
  variant = 'surface',
  label,
  rounded = 'rounded-card',
  bordered = true,
  className = '',
  children,
}: PagePlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${STRIPE[variant]} ${rounded} ${
        bordered ? BORDER[variant] : ''
      } ${className}`.trim()}
    >
      {children ??
        (label ? (
          <span
            className={`font-display text-mini font-semibold uppercase tracking-eyebrow ${LABEL_TONE[variant]}`}
          >
            {label}
          </span>
        ) : null)}
    </div>
  )
}
