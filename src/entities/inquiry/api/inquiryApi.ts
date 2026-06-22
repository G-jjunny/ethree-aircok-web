import { queryOptions } from '@tanstack/react-query';
import type {
  CreateInquiryBody,
  InquiryListResponse,
  InquiryStatus,
  InquirySummary,
} from '../model/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

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
 * `status`로 인증 실패(401/403)와 일반 실패를 구분한다.
 */
export class InquiryApiError extends Error {
  readonly status: number;
  /** 검증 실패(400) 시 백엔드가 내려준 메시지 배열 */
  readonly messages?: string[];

  constructor(status: number, message: string, messages?: string[]) {
    super(message);
    this.name = 'InquiryApiError';
    this.status = status;
    this.messages = messages;
  }

  /** 인증/인가 실패 여부 (로그인 필요) */
  get isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }

  /** 검증 실패 여부 */
  get isValidationError(): boolean {
    return this.status === 400;
  }

  /** 요청 과다(Throttler) 여부 */
  get isRateLimited(): boolean {
    return this.status === 429;
  }
}

/**
 * 공개 문의 제출. 인증 불필요.
 * 정확히 { company, name, phone, email, message } 5개 키만 전송한다
 * (백엔드 ValidationPipe whitelist + forbidNonWhitelisted).
 * 성공 시 생성 객체 전체(201)를 반환하나 프론트는 무시 가능하다.
 */
export async function createInquiry(body: CreateInquiryBody): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        company: body.company,
        name: body.name,
        phone: body.phone,
        email: body.email,
        message: body.message,
      }),
    });
  } catch {
    throw new InquiryApiError(0, '네트워크 오류로 문의를 전송하지 못했습니다.');
  }

  if (!res.ok) {
    let messages: string[] | undefined;
    try {
      const data: unknown = await res.json();
      if (
        data &&
        typeof data === 'object' &&
        'message' in data &&
        Array.isArray((data as { message: unknown }).message)
      ) {
        messages = (data as { message: string[] }).message;
      }
    } catch {
      // 본문 파싱 실패는 무시 — 상태코드 기반으로 처리
    }

    const message =
      res.status === 429
        ? '요청이 많아 잠시 후 다시 시도해 주세요.'
        : res.status === 400
          ? '입력값을 다시 확인해 주세요.'
          : '문의 전송에 실패했습니다.';
    throw new InquiryApiError(res.status, message, messages);
  }
}

/**
 * 어드민 문의 목록을 브라우저에서 직접 호출한다.
 * `credentials: 'include'`로 access_token 쿠키를 전송하며,
 * 실패 시 상태코드를 담은 {@link InquiryApiError}를 throw한다.
 * (클라이언트 컴포넌트 전용 — 서버에서 호출하지 않는다.)
 */
export async function getAdminInquiryList(
  page: number = 1,
  limit: number = 10,
): Promise<InquiryListResponse> {
  let res: Response;
  try {
    res = await fetch(
      `${API_BASE}/api/inquiry?page=${page}&limit=${limit}`,
      {
        cache: 'no-store',
        credentials: 'include',
      },
    );
  } catch {
    throw new InquiryApiError(
      0,
      '네트워크 오류로 문의 목록을 불러오지 못했습니다.',
    );
  }

  if (!res.ok) {
    const message =
      res.status === 401 || res.status === 403
        ? '로그인이 필요합니다.'
        : '문의 목록을 불러오는 데 실패했습니다.';
    throw new InquiryApiError(res.status, message);
  }

  return res.json() as Promise<InquiryListResponse>;
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
    retry: (failureCount, error) => {
      if (error instanceof InquiryApiError && error.isAuthError) return false;
      return failureCount < 1;
    },
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
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/inquiry/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status }),
    });
  } catch {
    throw new InquiryApiError(0, '네트워크 오류로 상태를 변경하지 못했습니다.');
  }

  if (!res.ok) {
    const message =
      res.status === 401 || res.status === 403
        ? '로그인이 필요합니다.'
        : res.status === 404
          ? '문의를 찾을 수 없습니다.'
          : '상태 변경에 실패했습니다.';
    throw new InquiryApiError(res.status, message);
  }

  return res.json() as Promise<InquirySummary>;
}

/**
 * 문의 삭제(DELETE). 인증 필요(JwtAuthGuard).
 * 성공 시 204(본문 없음).
 */
export async function deleteInquiry(id: string): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/inquiry/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  } catch {
    throw new InquiryApiError(0, '네트워크 오류로 삭제하지 못했습니다.');
  }

  if (!res.ok) {
    const message =
      res.status === 401 || res.status === 403
        ? '로그인이 필요합니다.'
        : res.status === 404
          ? '문의를 찾을 수 없습니다.'
          : '삭제에 실패했습니다.';
    throw new InquiryApiError(res.status, message);
  }
}
