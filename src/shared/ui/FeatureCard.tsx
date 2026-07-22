type FeatureCardProps = {
  title: string
  description: string
  theme?: 'light' | 'dark'
}

export function FeatureCard({ title, description, theme = 'light' }: FeatureCardProps) {
  const isDark = theme === 'dark'
  return (
    <div
      className={`rounded-xl p-8 flex flex-col gap-3 ${
        isDark ? 'bg-surface-dark-1' : 'bg-surface-light'
      }`}
    >
      <h3
        className={`text-[21px] font-bold leading-[1.19] ${
          isDark ? 'text-heading-light' : 'text-heading-dark'
        }`}
      >
        {title}
      </h3>
      <p
        className={`text-[17px] leading-[1.65] [word-break:keep-all] ${
          isDark ? 'text-body-light' : 'text-body-dark'
        }`}
      >
        {description}
      </p>
    </div>
  )
}
