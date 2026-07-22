/**
 * 공기질 측정기 캐시 태그 — 순수 문자열 상수(서버·클라 무관, 런타임 번들 안전).
 * 서버 페처('use cache' 래퍼)와 'use server' 무효화(revalidateAirDevices)가 공유한다.
 *
 * 서버 전용 심볼로 취급해 `@/entities/air-device/server`에서만 노출한다(news 패턴).
 */

/** 측정기 목록 캐시 태그. 어드민 create/update/delete/reorder 후 updateTag로 무효화한다. */
export const AIR_DEVICES_CACHE_TAG = 'air-devices';
