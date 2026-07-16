import { Children, cloneElement, isValidElement } from 'react'
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'dark' | 'outline' | 'white' | 'secondary' | 'destructive'
type ButtonSize = 'sm' | 'md'

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  /**
   * 시각 스타일. 시안 매핑: primary=히어로/헤더 CTA, dark=라이트 섹션 보조 CTA,
   * outline=다크/컬러 배경 위 보조, white=CTA 컬러 섹션의 흰 버튼,
   * secondary=라이트 배경 위 중립 보조(다시 시도/취소), destructive=파괴적 액션(삭제).
   */
  variant?: ButtonVariant
  /** sm=헤더/인라인(작음, 데스크톱용) · md=단독 CTA(44px 터치 타겟) */
  size?: ButtonSize
  /** true면 rounded-pill(완전 pill). 헤더 도입 문의 pill 등. 기본 rounded-btn(12) */
  pill?: boolean
  /**
   * true면 <button> 대신 넘겨받은 단일 자식 엘리먼트에 스타일을 병합한다.
   * Next <Link> CTA에 사용: <Button asChild variant="primary"><Link href="/x">제품 살펴보기</Link></Button>
   */
  asChild?: boolean
  className?: string
  children: ReactNode
}

// 공통 골격 — 상호작용 상태(hover/active/focus-visible/disabled)를 모든 variant가 공유한다.
const BASE =
  'inline-flex items-center justify-center gap-2 text-center whitespace-nowrap select-none cursor-pointer ' +
  'transition-all duration-fast ease-out active:scale-[0.98] ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed ' +
  'aria-disabled:pointer-events-none aria-disabled:opacity-50 aria-disabled:cursor-not-allowed'

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    'font-semibold bg-linear-to-br from-brand to-brand-hover text-brand-ink hover:brightness-110 focus-visible:ring-brand',
  dark: 'font-semibold bg-navy text-white hover:bg-navy-deep focus-visible:ring-brand',
  outline:
    'font-semibold border border-white/50 text-white hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-transparent',
  white:
    'font-bold bg-surface-white text-brand shadow-soft hover:bg-white/90 focus-visible:ring-white focus-visible:ring-offset-brand',
  // secondary/destructive 는 ConfirmDialog 의 취소/삭제 버튼 톤을 그대로 승계하되
  // 구 토큰(surface-light/heading-dark/border-light/aircok-blue/heading-light)이 아닌
  // design.md §6 대응표의 신 토큰으로 옮겨 정의한다(색상값 자체는 alias 라 동일).
  secondary:
    'font-semibold bg-surface text-ink hover:bg-hairline focus-visible:ring-brand',
  destructive:
    'font-semibold bg-error text-white hover:opacity-90 focus-visible:ring-error',
}

// 가로 패딩은 클린 그리드 스텝(px-5/px-6)만 사용 — globals 의 --spacing-5~10 임시 오염을
// 피하고(px-7=48px 회귀 방지) 오염 제거 후에도 자연스럽게 20/24px 로 안착한다.
// 세로/최소높이는 안정 스텝(py-2.5=10, py-4=16, min-h-11=44 터치타겟).
const SIZE: Record<ButtonSize, string> = {
  sm: 'px-5 py-2.5 text-sm',
  md: 'px-6 py-4 text-base min-h-11',
}

function composeClasses({
  variant,
  size,
  pill,
  className,
}: {
  variant: ButtonVariant
  size: ButtonSize
  pill: boolean
  className: string
}): string {
  // primary 만 글로우 그림자를 갖는다: sm(헤더 pill)=shadow-brand-sm, md(히어로/CTA)=shadow-brand
  const shadow =
    variant === 'primary' ? (size === 'sm' ? 'shadow-brand-sm' : 'shadow-brand') : ''
  return [BASE, VARIANT[variant], SIZE[size], pill ? 'rounded-pill' : 'rounded-btn', shadow, className]
    .filter(Boolean)
    .join(' ')
}

export function Button({
  variant = 'primary',
  size = 'md',
  pill = false,
  asChild = false,
  className = '',
  children,
  type,
  ...rest
}: ButtonProps) {
  const classes = composeClasses({ variant, size, pill, className })

  if (asChild) {
    const child = Children.only(children) as ReactElement<{ className?: string }>
    if (!isValidElement(child)) return null
    return cloneElement(child, {
      className: [classes, child.props.className].filter(Boolean).join(' '),
    })
  }

  return (
    <button type={type ?? 'button'} className={classes} {...rest}>
      {children}
    </button>
  )
}
