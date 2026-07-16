'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { AirDevice } from '@/entities/air-device'
import { SlotImage } from './SlotImage'

/** 제품 아래 브랜드 글로우 — 토큰 var() + color-mix 파생(하드코딩 아님). */
const CAROUSEL_GLOW =
  'radial-gradient(closest-side, color-mix(in oklab, var(--color-brand) 50%, transparent), transparent 70%)'

/** 기본 스펙 표의 라벨 — 시안 순서 고정(크기·무게·전원·통신·저장·작동온도). */
const SPEC_ROWS = [
  { label: '크기', pick: (d: AirDevice) => d.size },
  { label: '무게', pick: (d: AirDevice) => d.weight },
  { label: '전원', pick: (d: AirDevice) => d.power },
  { label: '통신 방식', pick: (d: AirDevice) => d.comm },
  { label: '저장 방식', pick: (d: AirDevice) => d.storage },
  { label: '작동 온도', pick: (d: AirDevice) => d.operatingTemp },
] as const

/**
 * [실내] 공기질 측정기 캐러셀 + 활성 모델 스펙 — 클라이언트 leaf.
 *
 * 데이터는 서버(IndoorDeviceSection)가 조회해 props 로 내려주고, 이 컴포넌트는
 * **활성 인덱스 상태만** 갖는다(fetch/useEffect 없음). 시안 스크립트 상태 모델과 동일하게
 * prev/next 는 모듈러 순환(`(active ± 1 + n) % n`)이고 카드·dot 클릭은 직접 선택이다.
 *
 * 호출부가 `devices.length > 0` 을 보장한다(빈 배열은 서버 섹션에서 폴백 처리).
 */
export function IndoorDeviceCarousel({ devices }: { devices: AirDevice[] }) {
  const [active, setActive] = useState(0)

  const total = devices.length
  // 데이터가 줄어드는 재렌더에도 인덱스가 범위를 벗어나지 않도록 방어한다.
  const activeIndex = Math.min(active, total - 1)
  const activeDevice = devices[activeIndex]

  const goPrev = () => setActive((i) => (i - 1 + total) % total)
  const goNext = () => setActive((i) => (i + 1) % total)

  return (
    <>
      {/* ── 캐러셀 프레임 ── */}
      <div className="relative mt-11 overflow-hidden rounded-t-card-lg border border-hairline bg-linear-to-b from-surface-white to-surface px-6 pt-11">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-11 left-1/2 h-42 w-140 -translate-x-1/2 blur-sm"
          style={{ backgroundImage: CAROUSEL_GLOW }}
        />

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="이전 제품"
              className="absolute left-5 top-1/2 z-20 flex h-11.5 w-11.5 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-surface-white/92 text-brand shadow-card transition-colors duration-fast hover:bg-surface-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="다음 제품"
              className="absolute right-5 top-1/2 z-20 flex h-11.5 w-11.5 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-surface-white/92 text-brand shadow-card transition-colors duration-fast hover:bg-surface-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* 카드 — 활성 카드는 크게(360) + 브랜드 글로우, 비활성은 작게(220) + 축소·감광 */}
        <div className="relative z-10 flex min-h-75 items-center justify-center gap-6">
          {devices.map((device, i) => {
            const isActive = i === activeIndex
            return (
              <button
                type="button"
                key={device.id}
                onClick={() => setActive(i)}
                aria-label={`${device.name} 선택`}
                aria-pressed={isActive}
                className={`flex flex-none cursor-pointer flex-col items-center gap-3.5 transition-transform duration-fast ease-out ${
                  isActive ? 'scale-100' : 'scale-90'
                }`}
              >
                <SlotImage
                  src={device.imageUrl}
                  alt={device.name}
                  label={device.name}
                  variant="surface"
                  rounded="rounded-image"
                  className={`aspect-card max-w-full bg-surface-white transition-all duration-fast ease-out ${
                    isActive
                      ? 'w-90 border border-hairline shadow-brand'
                      : 'w-55 border border-hairline opacity-62 shadow-card'
                  }`}
                  sizes="(min-width: 768px) 360px, 60vw"
                />
                <span
                  className={`font-display text-meta font-bold tracking-headline ${
                    isActive ? 'text-brand' : 'text-faint'
                  }`}
                >
                  {device.name}
                </span>
              </button>
            )
          })}
        </div>

        {/* dots */}
        {total > 1 && (
          <div className="relative z-10 mt-5 flex justify-center gap-2 pb-5">
            {devices.map((device, i) => (
              <button
                type="button"
                key={device.id}
                onClick={() => setActive(i)}
                aria-label={`${device.name} 선택`}
                aria-current={i === activeIndex}
                className={`h-2 cursor-pointer rounded-pill transition-all duration-fast ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  i === activeIndex ? 'w-5 bg-brand' : 'w-2 bg-faint/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── 활성 모델 헤더 바 ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-b-btn bg-linear-120 from-brand to-brand-hover px-6 py-5 shadow-card">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="font-display text-2xl font-extrabold tracking-headline text-white">
            {activeDevice.name}
          </span>
          <span className="text-meta text-white/80">{activeDevice.subtitle}</span>
        </div>
        {activeDevice.badge && (
          <span className="rounded-pill border border-white/32 bg-white/16 px-3.5 py-1.5 text-eyebrow font-bold text-white">
            {activeDevice.badge}
          </span>
        )}
      </div>

      {/* ── 측정 항목 ── */}
      {activeDevice.items.length > 0 && (
        <div className="mt-5 rounded-card-lg border border-hairline bg-surface-white p-6 shadow-card">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-lead font-extrabold text-ink">측정 항목</h3>
            <p className="text-sm text-muted">
              온도·습도·미세먼지 등{' '}
              <b className="font-bold text-brand">{activeDevice.items.length}종</b>을
              측정합니다
            </p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {activeDevice.items.map((item) => (
              <div
                key={item.id}
                className="rounded-btn border border-tint-border bg-tint px-4 py-3.5"
              >
                <div className="font-display text-eyebrow font-bold text-brand">
                  {item.code}
                </div>
                <div className="mt-1 text-meta font-semibold text-ink">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 기본 스펙 ── */}
      <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SPEC_ROWS.map((row) => (
          <div
            key={row.label}
            className="rounded-2xl border border-hairline bg-surface-white p-5"
          >
            <dt className="font-display text-mini font-bold tracking-label text-muted">
              {row.label}
            </dt>
            <dd className="mt-2 text-base font-extrabold text-ink">{row.pick(activeDevice)}</dd>
          </div>
        ))}
      </dl>
    </>
  )
}
