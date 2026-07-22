import type { ReactNode } from 'react'

/**
 * AIR CHEF(주방 탭) 전용 eyebrow 라벨.
 *
 * shared/ui 의 SectionLabel 은 color 가 `brand | cyan` 뿐이라 chef 계열을 표현할 수 없어
 * 주방 탭 로컬로 둔 대응 컴포넌트다(SectionLabel 과 동일한 골격: Sora · uppercase · 600).
 * → SectionLabel 에 chef/chef-soft variant 추가는 design 소관이므로 보고만 한다.
 *
 * 대비 규칙(design.md §2): 라이트 배경 = `chef`, `bg-chef-dark` 배경 위 = `chef-soft`.
 */
type ChefLabelTone = 'chef' | 'chef-soft'
type ChefLabelSize = 'md' | 'sm'

const TONE: Record<ChefLabelTone, string> = {
  chef: 'text-chef',
  'chef-soft': 'text-chef-soft',
}

// SectionLabel 과 동일 스케일: md=섹션 eyebrow(12.5 / .18) · sm=카드 eyebrow(11 / .14)
const SIZE: Record<ChefLabelSize, string> = {
  md: 'text-eyebrow tracking-eyebrow-lg',
  sm: 'text-mini tracking-eyebrow',
}

export function ChefLabel({
  children,
  tone = 'chef',
  size = 'md',
  className = '',
}: {
  children: ReactNode
  /** 라이트 배경=chef · bg-chef-dark 배경 위=chef-soft. */
  tone?: ChefLabelTone
  size?: ChefLabelSize
  className?: string
}) {
  return (
    <span
      className={`inline-block font-display font-semibold uppercase ${TONE[tone]} ${SIZE[size]} ${className}`.trim()}
    >
      {children}
    </span>
  )
}
