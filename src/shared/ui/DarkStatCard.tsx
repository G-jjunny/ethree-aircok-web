import type { ReactNode } from 'react'

type DarkStatCardProps = {
  category: string
  stat: string
  title: string
  description: string
  source?: string
}

const iconBaseProps = {
  className: 'size-6',
  'aria-hidden': true,
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
  strokeWidth: 1.5,
} as const

// 카테고리별 라인 아이콘 (currentColor stroke) — design.md "Stat Category Icon" 규칙
const CATEGORY_ICONS: Record<string, ReactNode> = {
  // Concentration: 집중(과녁/타깃)
  Concentration: (
    <svg {...iconBaseProps}>
      <circle cx="12" cy="12" r="8.25" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  // Value: 가치상승(우상향 추세)
  Value: (
    <svg {...iconBaseProps}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 16.5 9 11.25l3 3 5.25-5.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9h3.75v3.75" />
    </svg>
  ),
  // Cost: 에너지/절감(번개)
  Cost: (
    <svg {...iconBaseProps}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3 5.25 13.5h6l-0.75 7.5 7.5-10.5h-6l0.75-7.5Z" />
    </svg>
  ),
  // Air Quality: 공기 흐름(바람결)
  'Air Quality': (
    <svg {...iconBaseProps}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.25h11.25a2.25 2.25 0 1 0-2.25-2.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h15a2.25 2.25 0 1 1-2.25 2.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 15.75h8.25a2.25 2.25 0 1 1-2.25 2.25" />
    </svg>
  ),
}

export function DarkStatCard({
  category,
  stat,
  title,
  description,
  source,
}: DarkStatCardProps) {
  const icon = CATEGORY_ICONS[category]

  return (
    <div className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-xl bg-surface-dark-1 px-5 py-6 transition-all duration-200 hover:-translate-y-1 hover:bg-surface-dark-2">
      {icon && (
        <span className="flex size-11 items-center justify-center rounded-lg bg-overlay-white-10 text-aircok-blue-light">
          {icon}
        </span>
      )}
      <span className="text-xs font-semibold uppercase tracking-widest text-aircok-blue-light">
        {category}
      </span>
      <span className="text-6xl font-bold leading-none text-heading-light">
        {stat}
      </span>
      {/* lg:min-h-[2.4em]: 4열 좁은 폭에서 1줄/2줄 제목 모두 동일 영역 점유 → description 시작점 통일 (design.md "title 정렬 규칙") */}
      <h3 className="mt-2 text-2xl font-bold leading-[1.19] text-heading-light [word-break:keep-all] lg:min-h-[2.4em]">
        {title}
      </h3>
      <p className="flex-1 text-sm leading-[1.65] text-body-light [word-break:keep-all]">
        {description}
      </p>
      {source && (
        <p className="mt-auto text-xs italic text-body-light opacity-50">
          {source}
        </p>
      )}
    </div>
  )
}
