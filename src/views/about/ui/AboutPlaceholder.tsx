import type { ReactNode } from 'react'

// 대각 줄무늬 플레이스홀더 패턴 — 색은 토큰 var() 참조(하드코딩 아님).
// 이미지 자산 미확보 섹션(MISSION/STATS/성능인증 마크)에서 공용으로 사용.
const STRIPE_LIGHT =
  'repeating-linear-gradient(135deg, var(--color-surface) 0, var(--color-surface) 10px, var(--color-tint) 10px, var(--color-tint) 20px)'
const STRIPE_DARK =
  'repeating-linear-gradient(135deg, oklch(100% 0 0 / 0.04) 0, oklch(100% 0 0 / 0.04) 10px, oklch(100% 0 0 / 0.08) 10px, oklch(100% 0 0 / 0.08) 20px)'

interface AboutPlaceholderProps {
  /** aspect-ratio 유틸 클래스 (예: 'aspect-[4/3]'). 미지정 시 부모 높이 채움. */
  className?: string
  /** 라벨 텍스트(줄무늬 위 중앙 표기). */
  label?: string
  /** 다크 섹션 위 배치 여부 — 줄무늬/텍스트 대비 전환. */
  theme?: 'light' | 'dark'
  children?: ReactNode
}

/**
 * 이미지 자산 미확보 자리를 채우는 줄무늬 플레이스홀더 블록.
 * About 로컬 전용(shared/ui 승격 대상 아님 — 이 페이지 한정 bespoke).
 */
export function AboutPlaceholder({
  className = '',
  label,
  theme = 'light',
  children,
}: AboutPlaceholderProps) {
  const isDark = theme === 'dark'
  return (
    <div
      className={`flex items-center justify-center overflow-hidden rounded-card ${
        isDark ? 'border border-white/8' : 'border border-hairline'
      } ${className}`}
      style={{ backgroundImage: isDark ? STRIPE_DARK : STRIPE_LIGHT }}
    >
      {children ??
        (label ? (
          <span
            className={`font-display text-mini uppercase tracking-eyebrow ${
              isDark ? 'text-white/40' : 'text-faint'
            }`}
          >
            {label}
          </span>
        ) : null)}
    </div>
  )
}
