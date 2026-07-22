type DateLabelProps = {
  /** ISO 날짜 문자열 (예: 2025-01-01T00:00:00.000Z) */
  date: string
  theme?: 'light' | 'dark'
  /** hero용 레이블 변형 — tracking-widest uppercase 추가 */
  emphasis?: boolean
  className?: string
}

function formatDate(dateStr: string): string {
  return dateStr.slice(0, 10).replace(/-/g, '.')
}

/**
 * Aircok 날짜 레이블. ISO 문자열을 YYYY.MM.DD 로 표시하는 공용 time 컴포넌트.
 * theme(light|dark) · emphasis(hero 변형) 옵션 제공.
 */
export function DateLabel({
  date,
  theme = 'light',
  emphasis = false,
  className = '',
}: DateLabelProps) {
  const color = theme === 'dark' ? 'text-aircok-blue-light' : 'text-aircok-blue'
  const tracking = emphasis ? 'tracking-widest uppercase' : 'tracking-wide'

  return (
    <time
      dateTime={date}
      className={`${color} text-xs font-body ${tracking} ${className}`.trim()}
    >
      {formatDate(date)}
    </time>
  )
}
