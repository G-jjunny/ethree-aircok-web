/**
 * 공기질 측정기 엔티티의 **클라이언트 안전** public API.
 *
 * 서버 전용 심볼(getAirDeviceListServer / AIR_DEVICES_CACHE_TAG)은 클라이언트 번들 유출
 * 방지를 위해 이 배럴이 아니라 `@/entities/air-device/server`에서만 노출한다.
 * (배럴이 next/cache를 끌어오면 렌더 워커 크래시로 동적 라우트가 500이 난다 — PR #119 회귀)
 */
export type {
  AirDevice,
  AirDeviceItem,
  AirDeviceInput,
  AirDeviceItemInput,
  AirDeviceUpdateInput,
} from './model/types';
export { airDeviceKeys } from './api/airDeviceKeys';
export {
  AirDeviceApiError,
  getAirDeviceList,
  airDeviceListQueryOptions,
  getAdminAirDeviceList,
  adminAirDeviceListQueryOptions,
} from './api/airDeviceApi';
export { revalidateAirDeviceCache } from './api/revalidateAirDevices';
