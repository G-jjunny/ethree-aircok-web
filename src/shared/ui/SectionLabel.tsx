import type { ReactNode } from 'react'

type SectionLabelColor = 'brand' | 'cyan'
type SectionLabelSize = 'md' | 'sm'

export type SectionLabelProps = {
  children: ReactNode
  /** brand=라이트 섹션 eyebrow(WHY SMART AIRCOK 등) · cyan=다크/포인트 eyebrow(WHAT YOU GET 등) */
  color?: SectionLabelColor
  /** md=섹션 eyebrow(12.5 / tracking .18) · sm=카드 eyebrow(11 / tracking .14) */
  size?: SectionLabelSize
  /** 렌더 태그. 기본 span(헤딩 위 인라인 배치). */
  as?: 'span' | 'p' | 'div'
  className?: string
}

// eyebrow 는 Sora(font-display) · uppercase · 600 고정. 색/크기만 variant.
const BASE = 'inline-block font-display font-semibold uppercase'

const COLOR: Record<SectionLabelColor, string> = {
  brand: 'text-brand',
  cyan: 'text-cyan',
}

const SIZE: Record<SectionLabelSize, string> = {
  md: 'text-eyebrow tracking-eyebrow-lg',
  sm: 'text-mini tracking-eyebrow',
}

export function SectionLabel({
  children,
  color = 'brand',
  size = 'md',
  as: Tag = 'span',
  className = '',
}: SectionLabelProps) {
  return (
    <Tag className={[BASE, COLOR[color], SIZE[size], className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  )
}
