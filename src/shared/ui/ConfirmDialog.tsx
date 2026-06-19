'use client'

import { useEffect, useRef } from 'react'

export interface ConfirmDialogProps {
  /** 열림 여부. false면 렌더하지 않는다. */
  open: boolean
  /** 제목 (예: "로그아웃", "뉴스 삭제") */
  title: string
  /** 설명/경고 문구 */
  description?: string
  /** 확인 버튼 라벨 (기본 '확인') */
  confirmLabel?: string
  /** 취소 버튼 라벨 (기본 '취소') */
  cancelLabel?: string
  /** 확인 버튼 색 결정 (기본 'default') */
  variant?: 'default' | 'destructive'
  /** 확인 클릭 핸들러 */
  onConfirm: () => void
  /** 취소/닫기 핸들러 */
  onCancel: () => void
  /** 처리 중 — 버튼 비활성/스타일 처리 */
  loading?: boolean
}

const titleId = 'confirm-dialog-title'
const descId = 'confirm-dialog-desc'

const cancelButtonClass =
  'bg-surface-light text-heading-dark rounded-md px-5 py-2.5 min-h-[44px] text-[15px] font-medium hover:bg-border-light active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2'

const confirmDefaultClass =
  'bg-aircok-blue text-heading-light rounded-md px-5 py-2.5 min-h-[44px] text-[15px] font-medium hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2'

const confirmDestructiveClass =
  'bg-error text-heading-light rounded-md px-5 py-2.5 min-h-[44px] text-[15px] font-medium hover:opacity-90 active:scale-[0.97] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2'

// loading/disabled 공통: hover/active 제거 + opacity-60 cursor-not-allowed
const confirmDefaultDisabledClass =
  'bg-aircok-blue text-heading-light rounded-md px-5 py-2.5 min-h-[44px] text-[15px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2 opacity-60 cursor-not-allowed'

const confirmDestructiveDisabledClass =
  'bg-error text-heading-light rounded-md px-5 py-2.5 min-h-[44px] text-[15px] font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2 opacity-60 cursor-not-allowed'

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  variant = 'default',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)

  // Escape 키 → onCancel (loading 중에는 무시)
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!loading) onCancel()
        return
      }
      // 포커스 트랩: Tab/Shift+Tab 시 다이얼로그 내부 포커스 가능 요소 순환
      if (e.key === 'Tab') {
        const node = dialogRef.current
        if (!node) return
        const focusable = node.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) {
          e.preventDefault()
          return
        }
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        const active = document.activeElement
        if (e.shiftKey) {
          if (active === first || !node.contains(active)) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (active === last || !node.contains(active)) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, loading, onCancel])

  // body 스크롤 락
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  // 열릴 때 초기 포커스를 취소 버튼으로 이동
  useEffect(() => {
    if (!open) return
    cancelButtonRef.current?.focus()
  }, [open])

  // open이 false면 렌더하지 않는다.
  if (!open) return null

  const isDestructive = variant === 'destructive'

  const confirmClass = loading
    ? isDestructive
      ? confirmDestructiveDisabledClass
      : confirmDefaultDisabledClass
    : isDestructive
      ? confirmDestructiveClass
      : confirmDefaultClass

  return (
    <div
      className="fixed inset-0 z-50 bg-overlay-dark flex items-center justify-center px-5"
      onClick={() => {
        if (!loading) onCancel()
      }}
    >
      {/* token 없음: 확인 다이얼로그 카드 전용 너비 400px (Admin Login Card와 동일 1회성 수치) */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-white rounded-xl shadow-card w-full max-w-[400px] p-8 flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <h2
            id={titleId}
            className="text-[21px] font-bold text-heading-dark leading-[1.19] [word-break:keep-all]"
          >
            {title}
          </h2>
          {description && (
            <p
              id={descId}
              className="text-[15px] text-secondary-dark leading-[1.43] [word-break:keep-all]"
            >
              {description}
            </p>
          )}
        </div>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            disabled={loading}
            className={cancelButtonClass}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={confirmClass}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
