import Image from 'next/image'

/** 백엔드 API 베이스 URL(상대 경로 로고 폴백용). */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

// 마퀴 페이드 마스크(양끝 투명) — 색/간격 토큰이 아닌 마스킹 기법이라 inline 처리.
const MARQUEE_MASK =
  'linear-gradient(to right, transparent, black 12%, black 88%, transparent)'

/**
 * R2(절대 http URL)는 그대로, 슬래시 시작 상대 경로도 그대로(동일 출처 rewrite로 서빙),
 * 그 외 상대 경로만 API_BASE 를 접두어로 붙인다. (uploads 상대 경로 대응)
 */
function resolveLogoSrc(src: string): string {
  if (src.startsWith('http')) return src
  return src.startsWith('/') ? src : `${API_BASE}${src}`
}

/** 마퀴에 실리는 단일 항목 데이터. items 에 id 가 없으므로 name 을 식별에 사용. */
export type LogoMarqueeItem = {
  name: string
  /** 로고 이미지 경로(R2 절대 URL 또는 uploads 상대 경로). 없으면 이름 칩으로 폴백. */
  logoUrl?: string | null
}

export type LogoMarqueeProps = {
  items: LogoMarqueeItem[]
  /** 마퀴 줄 수. 1=단일 좌향 스크롤, 2=상단 좌향/하단 우향 교차. 기본 1. */
  rows?: 1 | 2
  /** 스크린리더용 마퀴 영역 라벨. 기본 '파트너사 로고'. */
  ariaLabel?: string
}

/** 한 항목의 로고 타일 / 이름 칩. 한 마퀴 내 높이는 h-20 으로 통일해 정렬을 맞춘다. */
function MarqueeCell({ item }: { item: LogoMarqueeItem }) {
  if (item.logoUrl) {
    return (
      <div className="group relative flex h-20 w-full items-center justify-center overflow-hidden rounded-btn border border-hairline bg-surface-white px-6">
        <Image
          src={resolveLogoSrc(item.logoUrl)}
          alt={item.name}
          width={128}
          height={56}
          sizes="128px"
          className="max-h-10 w-auto max-w-full object-contain transition-opacity duration-fast group-hover:opacity-30"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-fast group-hover:opacity-100">
          <span className="px-2 text-center text-xs font-semibold text-ink">
            {item.name}
          </span>
        </div>
      </div>
    )
  }

  // 이름 칩 폴백 — 로고 타일과 높이를 h-20 으로 통일(홈은 원래 h-16 이었으나 정렬 위해 승격).
  return (
    <div className="flex h-20 w-full items-center justify-center rounded-btn border border-hairline bg-surface px-4 text-center text-sm font-medium text-faint">
      {item.name}
    </div>
  )
}

/**
 * 마퀴 한 줄 — 목록을 2배 복제해 -50% 이동으로 끊김 없이 순환(CSS 애니메이션 전용).
 * 복제본(뒤쪽 절반)은 aria-hidden 처리해 스크린리더가 각 파트너를 한 번만 읽게 한다.
 */
function MarqueeRow({
  items,
  direction,
}: {
  items: LogoMarqueeItem[]
  direction: 'left' | 'right'
}) {
  const doubled = [...items, ...items]
  return (
    <div
      className="overflow-hidden"
      style={{ maskImage: MARQUEE_MASK, WebkitMaskImage: MARQUEE_MASK }}
    >
      <div
        className={`flex w-max gap-4 ${
          direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
        } hover:[animation-play-state:paused]`}
      >
        {doubled.map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            className="w-40 shrink-0"
            aria-hidden={i >= items.length || undefined}
          >
            <MarqueeCell item={item} />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 파트너 로고 무한 마퀴 — 홈/About 공용 순수 프레젠테이션 컴포넌트.
 * 데이터 패칭·상태 없음, hover 정지는 CSS-only 이므로 RSC(서버 컴포넌트)에서 직접 렌더 가능.
 * reduced-motion 정지는 globals.css 에서 전역 처리된다.
 *
 * - rows=1: 목록 전체를 좌향 단일 마퀴로.
 * - rows=2: 항목을 i%2 로 교차 분배(짝=상단 좌향, 홀=하단 우향).
 */
export function LogoMarquee({
  items,
  rows = 1,
  ariaLabel = '파트너사 로고',
}: LogoMarqueeProps) {
  if (items.length === 0) return null

  if (rows === 2) {
    const topRow = items.filter((_, i) => i % 2 === 0)
    const bottomRow = items.filter((_, i) => i % 2 === 1)
    return (
      <div role="group" aria-label={ariaLabel} className="flex flex-col gap-4">
        <MarqueeRow items={topRow} direction="left" />
        <MarqueeRow items={bottomRow} direction="right" />
      </div>
    )
  }

  return (
    <div role="group" aria-label={ariaLabel}>
      <MarqueeRow items={items} direction="left" />
    </div>
  )
}
