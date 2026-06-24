'use client'

interface FaqSidebarProps {
  categories: readonly string[]
  itemCounts: Record<string, number>
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function FaqSidebar({
  categories,
  itemCounts,
  activeCategory,
  onCategoryChange,
}: FaqSidebarProps) {
  return (
    <div className="hidden sm:block">
      <div className="sticky top-20">
        <p className="text-[12px] font-semibold text-secondary-dark uppercase tracking-wider mb-2">
          카테고리
        </p>
        <div className="flex flex-col gap-1">
          {categories.map((category) => {
            const isActive = activeCategory === category
            const count = itemCounts[category] ?? 0

            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={
                  isActive
                    ? 'w-full flex items-center justify-between text-[15px] font-semibold text-aircok-blue bg-surface-light rounded-md px-3 py-2 text-left'
                    : 'w-full flex items-center justify-between text-[15px] font-medium text-body-dark rounded-md px-3 py-2 hover:bg-surface-light hover:text-heading-dark transition-colors text-left'
                }
                aria-pressed={isActive}
              >
                <span>{category}</span>
                {isActive ? (
                  <span className="text-[12px] text-aircok-blue ml-auto tabular-nums">
                    {count}
                  </span>
                ) : (
                  <span className="text-[12px] text-secondary-dark bg-surface-light rounded-pill px-2 py-0.5 ml-auto tabular-nums">
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
