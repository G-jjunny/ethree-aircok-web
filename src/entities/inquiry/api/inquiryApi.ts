import axios from 'axios';
import { queryOptions } from '@tanstack/react-query';
import {
  axiosInstance,
  ApiError,
  authAwareRetry,
  parseAxiosMessages,
} from '@/shared/api';
import type {
  CreateInquiryBody,
  InquiryListResponse,
  InquiryStatus,
  InquirySummary,
} from '../model/types';

/**
 * 어드민 문의 관련 TanStack Query 키의 단일 출처(팩토리).
 * `invalidateQueries`는 prefix 부분 일치로 동작하므로,
 * 목록 전체 무효화는 `adminInquiryKeys.all`만으로 충분하다.
 */
export const adminInquiryKeys = {
  all: ['admin-inquiry'] as const,
  list: (page: number, limit: number) =>
    [...adminInquiryKeys.all, { page, limit }] as const,
};

/**
 * 문의 API 호출 실패를 나타내는 에러.
 * 공통 판별(`isAuthError`/`isValidationError`/`isRateLimited` 등)은
 * 베이스 {@link ApiError}에서 제공한다.
 */
export class InquiryApiError extends ApiError {}

/**
 * 공개 문의 제출. 인증 불필요.
 * 정확히 { answers } 1개 키만 전송한다
 * (백엔드 ValidationPipe whitelist + forbidNonWhitelisted — answers 내부 값은 모두 문자열).
 * 성공 시 생성 객체 전체(201)를 반환하나 프론트는 무시 가능하다.
 */
export async function createInquiry(body: CreateInquiryBody): Promise<void> {
  try {
    await axiosInstance.post('/inquiry', { answers: body.answers });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const messages = parseAxiosMessages(err.response?.data);
      const message =
        status === 429
          ? '요청이 많아 잠시 후 다시 시도해 주세요.'
          : status === 400
            ? '입력값을 다시 확인해 주세요.'
            : status === 0
              ? '네트워크 오류로 문의를 전송하지 못했습니다.'
              : '문의 전송에 실패했습니다.';
      throw new InquiryApiError(status, message, messages);
    }
    throw new InquiryApiError(0, '네트워크 오류로 문의를 전송하지 못했습니다.');
  }
}

/**
 * 어드민 문의 목록을 브라우저에서 직접 호출한다.
 * axiosInstance는 withCredentials: true이므로 쿠키가 자동 전송된다.
 * 실패 시 상태코드를 담은 {@link InquiryApiError}를 throw한다.
 * (클라이언트 컴포넌트 전용 — 서버에서 호출하지 않는다.)
 */
export async function getAdminInquiryList(
  page: number = 1,
  limit: number = 10,
): Promise<InquiryListResponse> {
  try {
    const { data } = await axiosInstance.get<InquiryListResponse>('/inquiry', {
      params: { page, limit },
    });
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const message =
        status === 401 || status === 403
          ? '로그인이 필요합니다.'
          : status === 0
            ? '네트워크 오류로 문의 목록을 불러오지 못했습니다.'
            : '문의 목록을 불러오는 데 실패했습니다.';
      throw new InquiryApiError(status, message);
    }
    throw new InquiryApiError(0, '네트워크 오류로 문의 목록을 불러오지 못했습니다.');
  }
}

/**
 * 어드민 문의 목록 TanStack Query 옵션.
 * 인증 의존 데이터이므로 staleTime을 0으로 두고, 인증 실패(401/403)는 재시도하지 않는다.
 */
export function adminInquiryQueryOptions(page: number = 1, limit: number = 10) {
  return queryOptions({
    queryKey: adminInquiryKeys.list(page, limit),
    queryFn: () => getAdminInquiryList(page, limit),
    staleTime: 0,
    retry: authAwareRetry,
  });
}

/**
 * 문의 상태 변경(PATCH). 인증 필요(JwtAuthGuard).
 * 성공 시 갱신 객체 전체(200)를 반환한다.
 */
export async function updateInquiryStatus(
  id: string,
  status: InquiryStatus,
): Promise<InquirySummary> {
  try {
    const { data } = await axiosInstance.patch<InquirySummary>(`/inquiry/${id}`, { status });
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const httpStatus = err.response?.status ?? 0;
      const message =
        httpStatus === 401 || httpStatus === 403
          ? '로그인이 필요합니다.'
          : httpStatus === 404
            ? '문의를 찾을 수 없습니다.'
            : httpStatus === 0
              ? '네트워크 오류로 상태를 변경하지 못했습니다.'
              : '상태 변경에 실패했습니다.';
      throw new InquiryApiError(httpStatus, message);
    }
    throw new InquiryApiError(0, '네트워크 오류로 상태를 변경하지 못했습니다.');
  }
}

/**
 * 문의 삭제(DELETE). 인증 필요(JwtAuthGuard).
 * 성공 시 204(본문 없음).
 */
export async function deleteInquiry(id: string): Promise<void> {
  try {
    await axiosInstance.delete(`/inquiry/${id}`);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const message =
        status === 401 || status === 403
          ? '로그인이 필요합니다.'
          : status === 404
            ? '문의를 찾을 수 없습니다.'
            : status === 0
              ? '네트워크 오류로 삭제하지 못했습니다.'
              : '삭제에 실패했습니다.';
      throw new InquiryApiError(status, message);
    }
    throw new InquiryApiError(0, '네트워크 오류로 삭제하지 못했습니다.');
  }
}
