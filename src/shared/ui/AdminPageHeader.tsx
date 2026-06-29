import React from 'react'

export interface AdminPageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode // 우측 액션 버튼 슬롯
}

export function AdminPageHeader({
  title,
  description,
  children,
}: AdminPageHeaderProps) {
  const hasChildren = Boolean(children)

  return (
    <div
      className={`bg-surface-white border-b border-border-light px-6 lg:px-8 py-5${
        hasChildren ? ' flex items-center justify-between gap-4' : ''
      }`}
    >
      {/* title + description 묶음 */}
      <div>
        {/* token 없음: admin 헤딩 전용 22px — design.md 타이포그래피 스케일에 미정의 1회성 수치 */}
        <h1 className="text-[22px] font-display font-semibold text-heading-dark leading-tight [word-break:keep-all]">
          {title}
        </h1>
        {description && (
          <p className="text-nav text-secondary-dark leading-[1.43] mt-0.5 [word-break:keep-all]">
            {description}
          </p>
        )}
      </div>

      {/* 우측 액션 슬롯 */}
      {hasChildren && (
        <div className="shrink-0">
          {children}
        </div>
      )}
    </div>
  )
}
