/**
 * `/services` 섹션 전용 라인 아이콘 세트(로컬).
 *
 * 시안(products) STEP 카드·장식 화살표에서만 쓰이는 1회성 아이콘이라 shared/ui 로 올리지 않는다.
 * 색상은 `stroke-current` 로 부모의 text-* 토큰을 따르므로 계열(brand/chef) 분기는 호출부가 결정한다.
 * 크기 역시 호출부 className(`size-*`)이 정한다 — 여기서 width/height 를 박지 않는다.
 */

type IconProps = {
  className?: string
}

const BASE = 'shrink-0 fill-none stroke-current stroke-2'

/** 막대그래프 — 측정(STEP 01, 실내). */
export function MeasureIcon({ className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`${BASE} ${className}`.trim()}
    >
      <path d="M12 20V10" />
      <path d="M18 20V4" />
      <path d="M6 20v-4" />
    </svg>
  )
}

/** 데이터베이스 — 저장·분석(STEP 02, 실내). */
export function DatabaseIcon({ className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`${BASE} ${className}`.trim()}
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14a9 3 0 0 0 18 0V5" />
      <path d="M3 12a9 3 0 0 0 18 0" />
    </svg>
  )
}

/** 모니터 — 모니터링·관리(STEP 03, 실내). */
export function MonitorIcon({ className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`${BASE} ${className}`.trim()}
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  )
}

/** 돋보기 — 진단(STEP 01, 주방). */
export function SearchIcon({ className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`${BASE} ${className}`.trim()}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

/** 반짝임 — 개선(STEP 02, 주방). */
export function SparkleIcon({ className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`${BASE} ${className}`.trim()}
    >
      <path d="M9.5 2 8 7l-5 1.5L8 10l1.5 5L11 10l5-1.5L11 7z" />
      <path d="M18 14l-1 3-3 1 3 1 1 3 1-3 3-1-3-1z" />
    </svg>
  )
}

/** 심전도 — 관리(STEP 03, 주방). */
export function PulseIcon({ className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`${BASE} ${className}`.trim()}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  )
}

/** 오른쪽 화살표 — STEP 사이 장식(계열색은 호출부 text-*). */
export function ArrowRightIcon({ className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`${BASE} ${className}`.trim()}
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}

/** 왼쪽 셰브런 — 캐러셀 이전 버튼. */
export function ChevronLeftIcon({ className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`${BASE} ${className}`.trim()}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

/** 오른쪽 셰브런 — 캐러셀 다음 버튼. */
export function ChevronRightIcon({ className = '' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`${BASE} ${className}`.trim()}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
