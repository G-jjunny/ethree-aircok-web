/**
 * 공기질 측정기 엔티티의 **서버 전용** public API.
 * 서버 컴포넌트/서버 파일만 이 진입점을 사용한다(클라이언트 번들 유출 방지).
 * 클라이언트 안전 심볼은 `@/entities/air-device`(배럴)에서 import한다.
 */
export { getAirDeviceListServer } from './api/airDeviceServerFetch';
export { AIR_DEVICES_CACHE_TAG } from './api/airDeviceCacheTags';
