import type { ReactNode } from 'react'

/**
 * 이미지 자산 미확보 자리를 채우는 표준 줄무늬 플레이스홀더.
 *
 * 시각 표준(design.md §4 stripes): -45deg 대각선 repeating-linear-gradient.
 *  - variant 'surface' → `stripes-surface`(회색계, hairline 라인)
 *  - variant 'tint'    → `stripes-tint`(연블루계, tint-border 라인)
 *  - variant 'dark'    → `stripes-dark`(네이비 섹션 위 흰색 반투명 라인)
 * 라벨은 항상 `font-display`(Sora) eyebrow 로 표기한다.
 *
 * 크기·비율(aspect)은 className 으로, 라운드는 rounded prop 으로 주입한다
 * (base 에 rounded 를 박지 않아 rounded-* 클래스 충돌을 방지).
 *
 * 뉴스 coverImage 폴백(NewsCard)·About 이미지 자리 등에서 공용으로 재사용한다.
 */
export type PagePlaceholderVariant = 'surface' | 'tint' | 'dark'

interface PagePlaceholderProps {
  /** 줄무늬 톤. 라이트 섹션=surface/tint, 다크(네이비) 섹션=dark. 기본 'surface'. */
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
}

const BORDER: Record<PagePlaceholderVariant, string> = {
  surface: 'border border-hairline',
  tint: 'border border-tint-border',
  dark: 'border border-white/8',
}

const LABEL_TONE: Record<PagePlaceholderVariant, string> = {
  surface: 'text-faint',
  tint: 'text-faint',
  dark: 'text-white/40',
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
