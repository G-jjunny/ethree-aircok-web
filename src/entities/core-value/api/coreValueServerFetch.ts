import axios from 'axios';
import { ApiError } from '@/shared/api';
import type { CoreValue } from '../model/types';

/**
 * 서버 컴포넌트 전용 핵심가치 조회 실패 에러.
 * 공통 판별(`isAuthError` 등)은 베이스 {@link ApiError}에서 제공한다.
 */
export class CoreValueServerApiError extends ApiError {}

/**
 * 서버/클라이언트 환경에 따라 API baseURL을 반환한다.
 * 서버 컴포넌트에서는 NestJS를 직접 가리키는 절대 URL을 사용한다(news/service-image 패턴).
 */
function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.API_URL ?? 'http://localhost:3001/api';
  }
  return '/api';
}

/**
 * 핵심가치 목록을 가져온다(서버 컴포넌트 안전).
 * axiosInstance의 401 인터셉터에 의존하지 않는 순수 axios 호출이므로
 * 서버 컴포넌트에서 직접 await할 수 있다. GET /core-values — order ASC 서버 정렬.
 */
export async function getCoreValueListServer(): Promise<CoreValue[]> {
  try {
    const { data } = await axios.get<CoreValue[]>(
      `${getApiBaseUrl()}/core-values`,
      { timeout: 10000 },
    );
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new CoreValueServerApiError(
        err.response?.status ?? 0,
        '핵심가치 목록을 불러오는 데 실패했습니다.',
      );
    }
    throw new CoreValueServerApiError(0, '네트워크 오류');
  }
}
