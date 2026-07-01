'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// 자동재생 전환 간격 (ms)
const AUTOPLAY_INTERVAL = 5000

type Value = { title: string; description: string }
type ValueCardStackProps = { values: readonly Value[] }

// 50px 대각 노치 — 참조 stagger-testimonials와 동일한 상단 우측 코너 컷
const NOTCH = 50
// NOTCH×NOTCH 정사각형의 대각선 길이 — 노치 모서리를 가로지르는 장식선 길이
const NOTCH_DIAGONAL = Math.sqrt(NOTCH * NOTCH * 2)
const CLIP_PATH = `polygon(${NOTCH}px 0%, calc(100% - ${NOTCH}px) 0%, 100% ${NOTCH}px, 100% 100%, calc(100% - ${NOTCH}px) 100%, ${NOTCH}px 100%, 0 100%, 0 0)`

// absPos(0~3+, 0이 활성)별 scale/opacity — 3 초과는 3의 위치를 유지한 채 opacity만 0으로 클램프
const SCALE_BY_ABS_POS = [1, 0.95, 0.88, 0.8]
const OPACITY_BY_ABS_POS = [1, 0.75, 0.55, 0.35]
const clamp3 = (absPos: number) => Math.min(absPos, 3)

export function ValueCardStack({ values }: ValueCardStackProps) {
  const [list, setList] = useState(() => values.map((_, i) => i))
  const [cardW, setCardW] = useState(300)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  // 수동 조작(prev/next 클릭, 카드 클릭) 시 증가시켜 자동재생 타이머를 리셋
  const [resetKey, setResetKey] = useState(0)

  const n = list.length
  const cardH = Math.round(cardW * 1.3)
  // 카드 중심 간격 (참조 컴포넌트: cardSize / 1.5)
  const hStep = Math.round(cardW / 1.5)

  useEffect(() => {
    const update = () =>
      setCardW(window.matchMedia('(min-width: 640px)').matches ? 300 : 260)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // 접근성: 모션 최소화 선호 여부 감지
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPrefersReducedMotion(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [])

  // pos = index - floor(n/2) → n=4: -2, -1, 0, +1  (pos=0 이 활성 카드)
  const getPos = (index: number) => index - Math.floor(n / 2)
  const activeIndex = Math.floor(n / 2)

  const move = useCallback((steps: number) => {
    if (steps === 0) return
    setList(prev => {
      const next = [...prev]
      if (steps > 0) {
        for (let i = 0; i < steps; i++) next.push(next.shift()!)
      } else {
        for (let i = 0; i < -steps; i++) next.unshift(next.pop()!)
      }
      return next
    })
  }, [])

  // prev/next 버튼, 카드 클릭 등 수동 조작 시 사용 — 자동재생 타이머를 리셋
  const handleManualMove = useCallback(
    (steps: number) => {
      move(steps)
      setResetKey(k => k + 1)
    },
    [move]
  )

  // 자동재생: hover/focus 중이거나 prefers-reduced-motion 이면 일시정지
  useEffect(() => {
    if (prefersReducedMotion || isHovered || isFocused) return
    const id = setInterval(() => {
      move(1)
    }, AUTOPLAY_INTERVAL)
    return () => clearInterval(id)
  }, [prefersReducedMotion, isHovered, isFocused, resetKey, move])

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="에어콕 핵심 가치"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <p className="sr-only" aria-live="polite">
        {values[list[activeIndex]].title} 카드 표시 중
      </p>

      {/* 카드 스테이지 — overflow-hidden 으로 사이드 카드 엣지 클리핑 */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: cardH + 60 }}
      >
        {list.map((valueIndex, listIndex) => {
          const pos = getPos(listIndex)
          const isActive = pos === 0
          const absPos = clamp3(Math.abs(pos))

          return (
            <button
              key={valueIndex}
              type="button"
              onClick={() => handleManualMove(pos)}
              aria-current={isActive ? 'true' : undefined}
              aria-label={isActive ? undefined : `${values[valueIndex].title} 카드로 이동`}
              style={{
                width: cardW,
                height: cardH,
                clipPath: CLIP_PATH,
                position: 'absolute',
                left: '50%',
                top: '50%',
                zIndex: n - Math.abs(pos),
                opacity: Math.abs(pos) > 3 ? 0 : OPACITY_BY_ABS_POS[absPos],
                transform: `
                  translate(-50%, -50%)
                  translateX(${hStep * (pos > 3 ? 3 : pos < -3 ? -3 : pos)}px)
                  translateY(${isActive ? -20 : pos % 2 !== 0 ? 15 : -15}px)
                  rotate(${isActive ? 0 : pos % 2 !== 0 ? 2.5 : -2.5}deg)
                  scale(${SCALE_BY_ABS_POS[absPos]})
                `,
                transition: 'all 500ms ease-in-out',
              }}
              className={[
                isActive ? 'gap-6' : 'gap-5',
                'flex flex-col p-8 text-left',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2',
                isActive
                  ? 'bg-aircok-blue cursor-default'
                  : 'bg-surface-light border border-border-light hover:border-aircok-blue/40 cursor-pointer',
                // 모바일: 비활성 카드 숨김 (sm 이상에서 전체 표시)
                !isActive ? 'hidden sm:flex' : 'flex',
              ].join(' ')}
            >
              {/* 노치 모서리를 가로지르는 장식선 */}
              <span
                aria-hidden="true"
                className={`absolute block origin-top-right rotate-45 ${
                  isActive ? 'bg-white/25' : 'bg-border-light'
                }`}
                style={{
                  right: -2,
                  top: NOTCH - 2,
                  width: NOTCH_DIAGONAL,
                  height: 2,
                }}
              />

              {/* 인덱스 번호 */}
              <span
                aria-hidden="true"
                className={`select-none font-display text-5xl font-bold leading-none tracking-[-0.3px] ${
                  isActive ? 'text-white/40' : 'text-aircok-blue'
                }`}
              >
                {String(valueIndex + 1).padStart(2, '0')}
              </span>

              {/* 텍스트 */}
              <div className="flex flex-col gap-3">
                <h3
                  className={`font-display text-xl font-bold leading-[1.19] [word-break:keep-all] ${
                    isActive ? 'text-white' : 'text-heading-dark'
                  }`}
                >
                  {values[valueIndex].title}
                </h3>
                <p
                  className={`text-[15px] leading-[1.65] [word-break:keep-all] ${
                    isActive ? 'text-white/80' : 'text-body-dark'
                  }`}
                >
                  {values[valueIndex].description}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* 네비게이션 버튼 */}
      <div className="flex items-center justify-center gap-3 mt-2">
        <button
          type="button"
          aria-label="이전 가치 보기"
          onClick={() => handleManualMove(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-pill border border-border-light bg-surface-white text-aircok-blue transition-colors duration-200 hover:bg-aircok-blue hover:text-white active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="다음 가치 보기"
          onClick={() => handleManualMove(1)}
          className="flex h-11 w-11 items-center justify-center rounded-pill border border-border-light bg-surface-white text-aircok-blue transition-colors duration-200 hover:bg-aircok-blue hover:text-white active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
