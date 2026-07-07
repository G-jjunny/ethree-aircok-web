import axios from 'axios';
import { ApiError } from '@/shared/api';
import type { SiteInfo } from '../model/types';

/**
 * 서버 컴포넌트 전용 사이트 정보 조회 실패 에러.
 * 공통 판별(`isAuthError` 등)은 베이스 {@link ApiError}에서 제공한다.
 */
export class SiteInfoServerApiError extends ApiError {}

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
 * 사이트 기본 정보를 가져온다(서버 컴포넌트 안전).
 * GET /site-info — 공개 엔드포인트, 단일 객체 반환.
 */
export async function getSiteInfoServer(): Promise<SiteInfo> {
  try {
    const { data } = await axios.get<SiteInfo>(
      `${getApiBaseUrl()}/site-info`,
      { timeout: 10000 },
    );
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new SiteInfoServerApiError(
        err.response?.status ?? 0,
        '사이트 정보를 불러오는 데 실패했습니다.',
      );
    }
    throw new SiteInfoServerApiError(0, '네트워크 오류');
  }
}
