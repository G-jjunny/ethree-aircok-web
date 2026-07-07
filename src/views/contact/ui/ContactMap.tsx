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

/**
 * 공개 문의 페이지의 회사 위치 지도.
 * 공개 GET으로 어드민이 설정한 주소를 조회하되, 에러 시
 * SITE.contact.address를 fallback으로 사용해 항상 지도가 보이게 한다.
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

  return (
    // 지도 — 카드 장식(shadow) 없이 절제: 둥근 모서리 + 얇은 보더만
    <div className="rounded-xl overflow-hidden border border-border-light aspect-video">
      <iframe
        title={`${SITE.name} 본사 위치 지도`}
        src={mapSrc}
        loading="lazy"
        className="w-full h-full border-none"
      />
    </div>
  )
}
