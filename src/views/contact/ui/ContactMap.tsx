import { connection } from 'next/server'
import { cacheLife, cacheTag } from 'next/cache'
import { getMapSettingServer, MAP_SETTING_CACHE_TAG, type MapSetting } from '@/entities/map-setting'
import { SITE } from '@/shared/config'

/** 지도 주소 설정 조회를 'use cache'로 캐싱(cacheTag: 'map-setting', cacheLife: static). */
async function getCachedMapSetting(): Promise<MapSetting> {
  'use cache'
  cacheLife('static')
  cacheTag(MAP_SETTING_CACHE_TAG)
  return getMapSettingServer()
}

/** 우상단 길찾기(↗) 아이콘 */
function ArrowUpRightIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 17 17 7M7 7h10v10"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * 공개 문의 페이지의 회사 위치 지도 카드.
 * 공개 GET으로 어드민이 설정한 주소를 조회하되, 에러 시
 * SITE.contact.address를 fallback으로 사용해 항상 지도가 보이게 한다.
 * 지도 영역 + 하단 주소 블록 + 길찾기 링크를 한 카드로 구성한다.
 */
export async function ContactMap() {
  // 빌드 타임 프리렌더(백엔드 미기동)에서 fetch가 실행되지 않도록 요청 시점으로 미룬다.
  await connection()

  let data: MapSetting | null = null
  try {
    data = await getCachedMapSetting()
  } catch {
    data = null
  }

  const address = data?.address ?? SITE.contact.address
  // Embed API 키 불필요한 일반 Google Maps 임베드 (output=embed)
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    address,
  )}&output=embed`
  // 길찾기(새 탭) — Google Maps directions
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    address,
  )}`

  return (
    <div className="overflow-hidden rounded-card border border-hairline bg-surface-white shadow-card">
      <div className="aspect-video w-full">
        <iframe
          title={`${SITE.name} 본사 위치 지도`}
          src={mapSrc}
          loading="lazy"
          className="h-full w-full border-none"
        />
      </div>
      <div className="flex items-start justify-between gap-4 p-6">
        <div>
          <p className="font-display text-mini font-semibold uppercase tracking-eyebrow text-muted">
            Address
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft [word-break:keep-all]">
            {address}
          </p>
        </div>
        <a
          href={directionsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-pill border border-hairline px-4 py-2 text-sm font-semibold text-brand transition-colors duration-fast ease-out hover:bg-tint"
        >
          길찾기
          <ArrowUpRightIcon />
        </a>
      </div>
    </div>
  )
}
