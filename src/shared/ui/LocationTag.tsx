type LocationTagProps = {
  /** 장소 텍스트. falsy면 렌더하지 않음 */
  location: string | null | undefined
  theme?: 'light' | 'dark'
  /** plain: 인라인 텍스트 / badge: 상세 hero의 pill 뱃지 */
  variant?: 'plain' | 'badge'
  iconSize?: 'sm' | 'md'
  className?: string
}

/**
 * 장소 + 핀 아이콘 공용 컴포넌트. 📍 이모지를 §4 Location Pin SVG로 대체하는 단일 출처.
 * design.md §13.2 계약.
 */
export function LocationTag({
  location,
  theme = 'light',
  variant = 'plain',
  iconSize = 'sm',
  className = '',
}: LocationTagProps) {
  if (!location) return null

  const icon = iconSize === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5'

  const tone =
    variant === 'badge'
      ? theme === 'dark'
        ? 'bg-overlay-white-10 backdrop-blur-sm rounded-pill px-3 py-1 text-xs text-body-light border border-border-dark'
        : 'bg-surface-white rounded-pill px-3 py-1 text-xs text-secondary-dark border border-border-light'
      : theme === 'dark'
        ? 'text-body-light opacity-60 text-xs'
        : 'text-secondary-dark text-xs'

  return (
    <span className={`inline-flex items-center gap-1 ${tone} ${className}`.trim()}>
      <svg
        className={`${icon} shrink-0`}
        aria-hidden="true"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
        />
      </svg>
      {location}
    </span>
  )
}
