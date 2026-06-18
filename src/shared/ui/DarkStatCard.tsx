type DarkStatCardProps = {
  category: string
  stat: string
  title: string
  description: string
  source?: string
}

export function DarkStatCard({ category, stat, title, description, source }: DarkStatCardProps) {
  return (
    <div className="bg-surface-dark-1 rounded-xl p-8 flex flex-col gap-4">
      <span className="text-aircok-blue-light text-xs font-semibold uppercase tracking-widest">
        {category}
      </span>
      <span className="text-5xl font-bold text-heading-light leading-none">{stat}</span>
      <h3 className="text-heading-light text-[21px] font-bold leading-[1.19] mt-2">{title}</h3>
      <p className="text-body-light text-sm leading-[1.65] [word-break:keep-all] flex-1">
        {description}
      </p>
      {source && (
        <p className="text-body-light opacity-50 text-xs italic mt-auto">{source}</p>
      )}
    </div>
  )
}
