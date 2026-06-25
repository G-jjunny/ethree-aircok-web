type DarkStatCardProps = {
  category: string
  stat: string
  title: string
  description: string
  source?: string
  /** 강조 카드 여부 — Aircok Blue 배경 + 대형 수치로 핵심 지표를 부각 */
  highlight?: boolean
}

export function DarkStatCard({
  category,
  stat,
  title,
  description,
  source,
  highlight = false,
}: DarkStatCardProps) {
  return (
    <div
      className={`group relative flex h-full flex-col gap-4 overflow-hidden rounded-xl p-8 transition-all duration-200 hover:-translate-y-1 ${
        highlight
          ? 'bg-aircok-blue shadow-product hover:bg-aircok-blue-dark'
          : 'bg-surface-dark-1 hover:bg-surface-dark-2'
      }`}
    >
      <span
        className={`text-xs font-semibold uppercase tracking-widest ${
          highlight ? 'text-heading-light opacity-80' : 'text-aircok-blue-light'
        }`}
      >
        {category}
      </span>
      <span
        className={`font-bold leading-none text-heading-light ${
          highlight ? 'text-7xl' : 'text-6xl'
        }`}
      >
        {stat}
      </span>
      <h3 className="mt-2 text-subheading font-bold leading-[1.19] text-heading-light [word-break:keep-all]">
        {title}
      </h3>
      <p
        className={`flex-1 text-sm leading-[1.65] [word-break:keep-all] ${
          highlight ? 'text-heading-light opacity-90' : 'text-body-light'
        }`}
      >
        {description}
      </p>
      {source && (
        <p
          className={`mt-auto text-xs italic ${
            highlight ? 'text-heading-light opacity-70' : 'text-body-light opacity-50'
          }`}
        >
          {source}
        </p>
      )}
    </div>
  )
}
