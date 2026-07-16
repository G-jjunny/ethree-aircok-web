import axios from 'axios';
import { ApiError } from '@/shared/api';
import type { MapSetting } from '../model/types';

/**
 * 서버 컴포넌트 전용 지도 주소 설정 조회 실패 에러.
 * 공통 판별(`isAuthError` 등)은 베이스 {@link ApiError}에서 제공한다.
 */
export class MapSettingServerApiError extends ApiError {}

/** 지도 주소 설정 캐시 태그. 어드민 지도 설정 수정 후 updateTag로 무효화한다. */
export const MAP_SETTING_CACHE_TAG = 'map-setting';

/**
 * 서버/클라이언트 환경에 따라 API baseURL을 반환한다.
 * 서버 컴포넌트에서는 NestJS를 직접 가리키는 절대 URL을 사용한다(news 패턴).
 */
function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.API_URL ?? 'http://localhost:3001/api';
  }
  return '/api';
}

/**
 * 지도 주소 설정을 가져온다(서버 컴포넌트 안전).
 * GET /inquiry/map-setting — 공개 엔드포인트, 백엔드가 행이 없으면 기본 주소로 lazy 생성.
 */
export async function getMapSettingServer(): Promise<MapSetting> {
  try {
    const { data } = await axios.get<MapSetting>(
      `${getApiBaseUrl()}/inquiry/map-setting`,
      { timeout: 10000 },
    );
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new MapSettingServerApiError(
        err.response?.status ?? 0,
        '지도 주소를 불러오는 데 실패했습니다.',
      );
    }
    throw new MapSettingServerApiError(0, '네트워크 오류');
  }
}
