import axios from 'axios';
import { queryOptions } from '@tanstack/react-query';
import {
  axiosInstance,
  ApiError,
  authAwareRetry,
  parseAxiosMessages,
} from '@/shared/api';
import type { MapSetting, UpdateMapSettingBody } from '../model/types';

/**
 * 지도 주소 설정 TanStack Query 키의 단일 출처(팩토리).
 * 싱글톤 리소스이므로 `all` 하나로 충분하다.
 */
export const mapSettingKeys = {
  all: ['map-setting'] as const,
};

/**
 * 지도 주소 설정 API 호출 실패를 나타내는 에러.
 * 공통 판별(`isAuthError`/`isValidationError` 등)은 베이스 {@link ApiError}에서 제공한다.
 */
export class MapSettingApiError extends ApiError {}

/**
 * 지도 주소 설정 조회. 공개 GET — axiosInstance의 withCredentials: true가 적용된다.
 * 응답은 비래핑 단일 객체이며 백엔드가 행이 없으면 기본 주소로 lazy 생성하므로 null이 오지 않는다.
 * 401/403 분기 메시지는 구조 일관성을 위해 유지한다(공개 GET이라 사실상 도달하지 않음).
 */
export async function getMapSetting(): Promise<MapSetting> {
  try {
    const { data } = await axiosInstance.get<MapSetting>('/inquiry/map-setting');
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const message =
        status === 401 || status === 403
          ? '로그인이 필요합니다.'
          : status === 0
            ? '네트워크 오류로 지도 주소를 불러오지 못했습니다.'
            : '지도 주소를 불러오는 데 실패했습니다.';
      throw new MapSettingApiError(status, message);
    }
    throw new MapSettingApiError(0, '네트워크 오류로 지도 주소를 불러오지 못했습니다.');
  }
}

/**
 * 지도 주소 설정 TanStack Query 옵션.
 * 공개 데이터이므로 staleTime을 1분으로 두고, 인증 실패(401/403)는 재시도하지 않는다.
 */
export function mapSettingQueryOptions() {
  return queryOptions({
    queryKey: mapSettingKeys.all,
    queryFn: getMapSetting,
    staleTime: 60_000,
    retry: authAwareRetry,
  });
}

/**
 * 지도 주소 설정 수정(PUT). 어드민 인증 필요(withCredentials: true).
 * 정확히 { address } 1개 키만 전송한다
 * (백엔드 ValidationPipe whitelist + forbidNonWhitelisted).
 * 성공 시 갱신 객체 전체(200)를 반환한다.
 */
export async function updateMapSetting(
  body: UpdateMapSettingBody,
): Promise<MapSetting> {
  try {
    const { data } = await axiosInstance.put<MapSetting>('/inquiry/map-setting', {
      address: body.address,
    });
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const messages = parseAxiosMessages(err.response?.data);
      const message =
        status === 401 || status === 403
          ? '로그인이 필요합니다.'
          : status === 400
            ? '입력값을 다시 확인해 주세요.'
            : status === 0
              ? '네트워크 오류로 지도 주소를 저장하지 못했습니다.'
              : '지도 주소 저장에 실패했습니다.';
      throw new MapSettingApiError(status, message, messages);
    }
    throw new MapSettingApiError(0, '네트워크 오류로 지도 주소를 저장하지 못했습니다.');
  }
}
