import React from 'react'

export interface AdminCardProps {
  /** 카드 제목. title/description/actions 중 하나라도 있으면 카드 헤더가 렌더된다. */
  title?: React.ReactNode
  /** 제목 아래 보조 설명. */
  description?: React.ReactNode
  /** 헤더 우측 액션 슬롯(버튼 등). */
  actions?: React.ReactNode
  /** 카드 본문. */
  children?: React.ReactNode
  /** 셸에 덧붙일 추가 className(패딩 조정·간격 등). 셸 기본 토큰은 유지된다. */
  className?: string
}

/**
 * 관리자 콘솔 공용 카드/섹션 박스.
 *
 * 정규 카드 셸 토큰(단일 표준): `rounded-card border border-hairline bg-surface-white p-6`.
 * - 기존 관리자 카드의 두 계열(`rounded-xl border-border-light`=구 alias / `rounded-card border-hairline`=신 토큰)을
 *   신 토큰 1종으로 수렴시킨다. AdminTabs 와 동일한 `bg-surface-white` + `border-hairline` 계열로 정합.
 * - title/description/actions 가 하나라도 있으면 선택적 카드 헤더를 렌더한다.
 *
 * 순수 프레젠테이션(슬롯/children 만 소비) — 이벤트 핸들러·상태 없음 → 서버 컴포넌트.
 */
export function AdminCard({
  title,
  description,
  actions,
  children,
  className,
}: AdminCardProps) {
  const hasHeader = Boolean(title || description || actions)
  const hasBody = Boolean(children)

  return (
    <div
      className={`rounded-card border border-hairline bg-surface-white p-6${
        className ? ` ${className}` : ''
      }`}
    >
      {hasHeader && (
        <div
          className={`flex items-start justify-between gap-4${
            hasBody ? ' mb-4' : ''
          }`}
        >
          {/* title + description 묶음 */}
          {(title || description) && (
            <div className="flex flex-col gap-1">
              {title && (
                <h2 className="text-lg font-semibold text-ink leading-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm text-muted leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          )}

          {/* 우측 액션 슬롯 */}
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}

      {children}
    </div>
  )
}
