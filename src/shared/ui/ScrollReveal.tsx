'use client'

import { useRef } from 'react'
import type { CSSProperties, ElementType, ReactNode, Ref } from 'react'

import { useIsomorphicLayoutEffect } from '@/shared/hooks'

/** 리빌 모션 프리셋. 톤/타이밍은 모두 `transition-all duration-500 ease-out`로 통일. */
export type ScrollRevealVariant = 'fade-up' | 'fade' | 'slide-left' | 'slide-right' | 'scale-in'

export interface ScrollRevealProps {
  /** 모션 프리셋. 기본 `'fade-up'`. */
  variant?: ScrollRevealVariant
  /** 진입 리빌 지연(ms). stagger용. 기본 `0`. transition-delay 인라인 스타일로만 처리. */
  delay?: number
  /** 래핑 태그. 기본 `'div'`. */
  as?: ElementType
  /** 래퍼에 병합할 추가 클래스. */
  className?: string
  children?: ReactNode
}

/** variant별 [숨김 상태, 표시 상태] 클래스. */
const VARIANT_CLASSES: Record<ScrollRevealVariant, { hidden: string; shown: string }> = {
  'fade-up': { hidden: 'opacity-0 translate-y-4', shown: 'opacity-100 translate-y-0' },
  fade: { hidden: 'opacity-0', shown: 'opacity-100' },
  'slide-left': { hidden: 'opacity-0 translate-x-4', shown: 'opacity-100 translate-x-0' },
  'slide-right': { hidden: 'opacity-0 -translate-x-4', shown: 'opacity-100 translate-x-0' },
  'scale-in': { hidden: 'opacity-0 scale-95', shown: 'opacity-100 scale-100' },
}

const TRANSITION_CLASSES = ['transition-all', 'duration-500', 'ease-out']

/**
 * 스크롤 진입 시 콘텐츠를 1회 리빌하는 공용 클라이언트 컴포넌트.
 *
 * 서버 컴포넌트(홈 섹션 등)가 콘텐츠를 `children`으로 감싸 적용할 수 있도록 설계됐다.
 *
 * 견고성:
 * - **No-JS / SSR / hydration 안전(progressive enhancement)**: SSR 출력에는 표시(shown) 클래스만
 *   들어가고 숨김/트랜지션 클래스는 없다. 숨김은 마운트 이후 layout effect에서 classList로만 적용하므로,
 *   JS 비활성 환경에서도 콘텐츠가 항상 보인다.
 * - **prefers-reduced-motion: reduce**: effect를 조기 종료해 표시 상태를 유지한다(관찰·모션 없음).
 * - **깜빡임(flash) 방지**: 숨김 클래스 주입을 `useIsomorphicLayoutEffect`(클라이언트=useLayoutEffect)로
 *   **첫 페인트 이전**에 커밋한다. 따라서 above-the-fold 요소도 shown이 잠깐 보였다 사라지는 플래시 없이
 *   숨김 상태로 첫 페인트된 뒤 진입 애니메이션만 재생된다. 리플로우로 숨김을 커밋한 뒤 트랜지션을 켠다.
 * - **className 변경 견고성**: className 문자열이 바뀌면 React가 class 속성을 재기록하며
 *   classList로 넣은 리빌 상태를 덮어쓴다. 이를 effect 의존성 `[variant, className]`로 감지해
 *   리빌 상태를 재확립한다(리빌 완료분은 `hasRevealedRef`로 기억해 재숨김 없이 shown 유지).
 * - **once**: 뷰포트 진입(threshold 0.1) 시 1회 리빌 후 `observer.disconnect()`.
 */
export function ScrollReveal({
  variant = 'fade-up',
  delay = 0,
  as,
  className = '',
  children,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null)
  // 리빌 1회 완료 여부. className 변경으로 effect가 재실행돼도 재숨김/재애니메이션 없이 shown을 유지한다.
  const hasRevealedRef = useRef(false)

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    // reduced-motion: 관찰·모션 없이 표시 상태 유지.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const hiddenClasses = VARIANT_CLASSES[variant].hidden.split(' ')
    const shownClasses = VARIANT_CLASSES[variant].shown.split(' ')

    // 이미 리빌된 요소인데 className 변경으로 React가 class를 재기록해 리빌 상태를 잃은 경우:
    // 재숨김/재애니메이션 없이 트랜지션·shown 상태만 복구한다.
    if (hasRevealedRef.current) {
      el.classList.add(...TRANSITION_CLASSES, ...shownClasses)
      el.classList.remove(...hiddenClasses)
      return
    }

    // 1) 표시 → 숨김으로 즉시 전환(트랜지션 미적용). layout effect라 첫 페인트 전에 커밋된다.
    el.classList.remove(...shownClasses)
    el.classList.add(...hiddenClasses)
    // 2) 강제 리플로우로 숨김 상태를 커밋한 뒤 트랜지션을 켠다 → shown 복귀만 애니메이션.
    void el.offsetWidth
    el.classList.add(...TRANSITION_CLASSES)

    const observer = new IntersectionObserver(
      ([entry]) => {
        // observe 직후 현재 상태로 콜백이 호출되므로 뷰포트 내 요소는 곧바로 리빌된다.
        if (entry.isIntersecting) {
          el.classList.remove(...hiddenClasses)
          el.classList.add(...shownClasses)
          hasRevealedRef.current = true
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [variant, className])

  // SSR/초기 렌더: 표시(shown) 클래스만. 트랜지션·숨김 클래스는 effect에서 주입한다.
  const shown = VARIANT_CLASSES[variant].shown

  // 동적 태그를 ElementType 그대로 JSX에 쓰면 intrinsic props 유니온이 붕괴(never)하므로,
  // 래퍼가 실제로 넘기는 props만 갖는 구체 컴포넌트 시그니처로 캐스팅한다.
  const Component = (as ?? 'div') as unknown as (props: {
    ref?: Ref<HTMLElement>
    className?: string
    style?: CSSProperties
    children?: ReactNode
  }) => ReactNode

  return (
    <Component
      ref={ref}
      className={`${shown} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  )
}
