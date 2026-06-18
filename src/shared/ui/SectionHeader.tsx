type SectionHeaderProps = {
  label?: string
  title: string
  body?: string
  theme?: 'light' | 'dark'
  titleAs?: 'h1' | 'h2'
  align?: 'left' | 'center'
  maxWidth?: string
}

export function SectionHeader({
  label,
  title,
  body,
  theme = 'light',
  titleAs: Tag = 'h2',
  align = 'left',
  maxWidth = 'max-w-[720px]',
}: SectionHeaderProps) {
  const isDark = theme === 'dark'
  const isCentered = align === 'center'
  return (
    <div className={`flex flex-col gap-4 ${isCentered ? 'items-center text-center' : ''}`}>
      {label && (
        <span
          className={`text-xs font-semibold uppercase tracking-widest ${
            isDark ? 'text-aircok-blue-light' : 'text-aircok-blue'
          }`}
        >
          {label}
        </span>
      )}
      <Tag
        className={`text-[28px] sm:text-[40px] font-semibold leading-[1.10] tracking-[-0.3px] [word-break:keep-all] ${maxWidth} ${
          isDark ? 'text-heading-light' : 'text-heading-dark'
        }`}
      >
        {title}
      </Tag>
      {body && (
        <p
          className={`text-[17px] leading-[1.65] [word-break:keep-all] max-w-[640px] ${
            isDark ? 'text-body-light' : 'text-body-dark'
          }`}
        >
          {body}
        </p>
      )}
    </div>
  )
}
