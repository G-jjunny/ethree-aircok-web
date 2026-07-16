'use client'

import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { SITE } from '@/shared/config'

type ServicesTabKey = 'indoor' | 'kitchen'

/**
 * 탭 메타 — en 라벨(계열 브랜드)·ko 라벨·활성 계열 색.
 *
 * 계열 분리 원칙(design.md §2): 실내 탭은 brand, 주방 탭은 chef 로 **활성 상태에서만** 계열색을 쓴다.
 * 탭바 자체(배경·보더·비활성 텍스트)는 계열 중립(surface/hairline/faint)이라 두 계열이 섞이지 않는다.
 */
const TABS: {
  key: ServicesTabKey
  en: string
  ko: string
  /** 활성 시 하단 인디케이터 보더 색. */
  activeBorder: string
  /** en 라벨 계열색(활성/비활성 모두 계열색 유지, 비활성은 감광). */
  enColor: string
}[] = [
  {
    key: 'indoor',
    en: SITE.nameEn,
    ko: '실내 공기질 관리시스템',
    activeBorder: 'border-brand',
    enColor: 'text-brand',
  },
  {
    key: 'kitchen',
    en: SITE.airChef.nameEn,
    ko: '주방 조리실 공기질 개선',
    activeBorder: 'border-chef',
    enColor: 'text-chef',
  },
]

/**
 * `/services` 2탭 셸 — sticky 탭바 + 활성 패널 렌더.
 *
 * **데이터 페칭은 하지 않는다.** 각 패널(서버 컴포넌트 트리)을 `indoor`/`kitchen` prop 으로
 * 받아 활성 탭만 렌더하므로, 'use client' 경계가 탭 상태에만 머물고 섹션들은 서버에서 렌더된다.
 * (탭 전환 시 재요청이 없어 즉시 전환된다.)
 */
export function ServicesTabs({
  indoor,
  kitchen,
}: {
  indoor: ReactNode
  kitchen: ReactNode
}) {
  const [tab, setTab] = useState<ServicesTabKey>('indoor')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  /**
   * 탭 선택 + 실제 포커스 이동(roving tabindex).
   *
   * 인덱스는 IndoorDeviceCarousel 의 prev/next 와 동일한 모듈러 순환(`(i ± 1 + n) % n`)이라
   * 끝에서 반대편으로 wrap-around 한다.
   */
  const selectTabAt = (index: number) => {
    const next = (index + TABS.length) % TABS.length
    setTab(TABS[next].key)
    tabRefs.current[next]?.focus()
  }

  /**
   * WAI-ARIA Tabs 키보드 패턴 — **자동 활성화**(포커스 이동 = 선택 변경).
   *
   * 두 패널 모두 서버에서 이미 렌더돼 있어(`hidden` 토글만 한다) 전환 비용이 0 이므로,
   * 수동 활성화(Enter/Space 확정)보다 자동 활성화가 적절하다.
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        selectTabAt(index + 1)
        break
      case 'ArrowLeft':
        e.preventDefault()
        selectTabAt(index - 1)
        break
      case 'Home':
        e.preventDefault()
        selectTabAt(0)
        break
      case 'End':
        e.preventDefault()
        selectTabAt(TABS.length - 1)
        break
    }
  }

  return (
    <>
      {/* sticky 탭바 — top-18(72px)은 전역 헤더 높이(py-4×2 + sm 버튼 40px).
          헤더의 1px 하단 보더 위로 겹치지만 헤더가 z-50 이라 위에 그려져 틈이 보이지 않는다. */}
      <div
        role="tablist"
        aria-label={SITE.pages.services.title}
        className="sticky top-18 z-40 border-b border-hairline bg-surface-white/90 backdrop-blur-md"
      >
        <div className="content-container flex gap-2 px-0">
          {TABS.map((t, i) => {
            const isActive = tab === t.key
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                id={`services-tab-${t.key}`}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                aria-selected={isActive}
                aria-controls={`services-panel-${t.key}`}
                /* roving tabindex — 탭바 전체가 Tab 키 스톱 1개만 차지하고,
                   내부 이동은 화살표/Home/End 가 담당한다(WAI-ARIA Tabs). */
                tabIndex={isActive ? 0 : -1}
                onClick={() => setTab(t.key)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className={`flex flex-1 cursor-pointer flex-col items-start gap-0.5 border-b-2 px-5 py-4 text-left transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand ${
                  isActive
                    ? `${t.activeBorder} text-ink`
                    : 'border-transparent text-faint hover:text-ink'
                }`}
              >
                <span
                  className={`font-display text-mini font-bold uppercase tracking-eyebrow ${t.enColor} ${
                    isActive ? 'opacity-100' : 'opacity-50'
                  }`}
                >
                  {t.en}
                </span>
                <span className="text-base font-bold">{t.ko}</span>
              </button>
            )
          })}
        </div>
      </div>

      {TABS.map((t) => (
        <div
          key={t.key}
          role="tabpanel"
          id={`services-panel-${t.key}`}
          aria-labelledby={`services-tab-${t.key}`}
          /* 패널 자체를 Tab 키 스톱으로 — 탭바에서 Tab 한 번에 패널 본문으로 진입한다. */
          tabIndex={0}
          hidden={tab !== t.key}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand"
        >
          {t.key === 'indoor' ? indoor : kitchen}
        </div>
      ))}
    </>
  )
}
