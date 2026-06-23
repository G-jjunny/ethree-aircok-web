import { queryOptions } from '@tanstack/react-query';
import type {
  CreateInquiryFieldBody,
  InquiryField,
  UpdateInquiryFieldBody,
} from '../model/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/**
 * 문의 필드 정의 TanStack Query 키의 단일 출처(팩토리).
 * 공개 폼과 어드민 빌더가 같은 목록을 공유하므로 `all` 하나로 충분하다.
 */
export const inquiryFieldKeys = {
  all: ['inquiry-field'] as const,
};

/**
 * 문의 필드 API 호출 실패를 나타내는 에러.
 * `status`로 인증 실패(401/403), 검증 실패(400), key 중복(409)을 구분한다.
 */
export class InquiryFieldApiError extends Error {
  readonly status: number;
  /** 검증 실패(400) 시 백엔드가 내려준 메시지 배열 */
  readonly messages?: string[];

  constructor(status: number, message: string, messages?: string[]) {
    super(message);
    this.name = 'InquiryFieldApiError';
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

  /** key 중복(충돌) 여부 */
  get isConflict(): boolean {
    return this.status === 409;
  }
}

/**
 * 응답 본문에서 백엔드 검증 메시지를 안전하게 추출한다.
 * NestJS ValidationPipe는 message를 string 또는 string[]로 내려주므로
 * 둘 다 string[]로 정규화한다.
 */
async function parseMessages(res: Response): Promise<string[] | undefined> {
  try {
    const data: unknown = await res.json();
    if (data && typeof data === 'object' && 'message' in data) {
      const message = (data as { message: unknown }).message;
      if (Array.isArray(message)) return message as string[];
      if (typeof message === 'string') return [message];
    }
  } catch {
    // 본문 파싱 실패는 무시 — 상태코드 기반으로 처리
  }
  return undefined;
}

/**
 * 공개 문의 필드 목록 조회. 인증 불필요.
 * 응답은 order 오름차순 정렬된 비래핑 배열이다.
 */
export async function getInquiryFields(): Promise<InquiryField[]> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/inquiry/fields`, {
      cache: 'no-store',
    });
  } catch {
    throw new InquiryFieldApiError(
      0,
      '네트워크 오류로 문의 필드를 불러오지 못했습니다.',
    );
  }

  if (!res.ok) {
    const message =
      res.status === 401 || res.status === 403
        ? '로그인이 필요합니다.'
        : '문의 필드를 불러오는 데 실패했습니다.';
    throw new InquiryFieldApiError(res.status, message);
  }

  return res.json() as Promise<InquiryField[]>;
}

/**
 * 문의 필드 목록 TanStack Query 옵션.
 * 공개 폼/어드민 빌더 공용. 인증 실패(401/403)는 재시도하지 않는다.
 */
export function inquiryFieldsQueryOptions() {
  return queryOptions({
    queryKey: inquiryFieldKeys.all,
    queryFn: getInquiryFields,
    staleTime: 0,
    retry: (failureCount, error) => {
      if (error instanceof InquiryFieldApiError && error.isAuthError)
        return false;
      return failureCount < 1;
    },
  });
}

/**
 * 문의 필드 생성(POST). 인증 필요(JwtAuthGuard).
 * 백엔드 ValidationPipe whitelist에 맞춰 값이 있는 키만 전송한다.
 * 성공 시 생성 객체(201)를 반환한다. key 중복은 409.
 */
export async function createInquiryField(
  body: CreateInquiryFieldBody,
): Promise<InquiryField> {
  const payload: CreateInquiryFieldBody = {
    key: body.key,
    label: body.label,
    type: body.type,
    required: body.required,
  };
  if (body.placeholder !== undefined) payload.placeholder = body.placeholder;
  if (body.order !== undefined) payload.order = body.order;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/inquiry/fields`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
  } catch {
    throw new InquiryFieldApiError(
      0,
      '네트워크 오류로 필드를 추가하지 못했습니다.',
    );
  }

  if (!res.ok) {
    const messages = await parseMessages(res);
    const message =
      res.status === 401 || res.status === 403
        ? '로그인이 필요합니다.'
        : res.status === 409
          ? '이미 사용 중인 키입니다.'
          : res.status === 400
            ? '입력값을 다시 확인해 주세요.'
            : '필드 추가에 실패했습니다.';
    throw new InquiryFieldApiError(res.status, message, messages);
  }

  return res.json() as Promise<InquiryField>;
}

/**
 * 문의 필드 수정(PATCH). 인증 필요.
 * 값이 있는 키만 전송한다(key는 변경 불가). 성공 시 갱신 객체(200)를 반환한다.
 */
export async function updateInquiryField(
  id: string,
  body: UpdateInquiryFieldBody,
): Promise<InquiryField> {
  const payload: UpdateInquiryFieldBody = {};
  if (body.label !== undefined) payload.label = body.label;
  if (body.type !== undefined) payload.type = body.type;
  if (body.required !== undefined) payload.required = body.required;
  if (body.placeholder !== undefined) payload.placeholder = body.placeholder;
  if (body.order !== undefined) payload.order = body.order;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/inquiry/fields/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
  } catch {
    throw new InquiryFieldApiError(
      0,
      '네트워크 오류로 필드를 수정하지 못했습니다.',
    );
  }

  if (!res.ok) {
    const messages = await parseMessages(res);
    const message =
      res.status === 401 || res.status === 403
        ? '로그인이 필요합니다.'
        : res.status === 404
          ? '필드를 찾을 수 없습니다.'
          : res.status === 400
            ? '입력값을 다시 확인해 주세요.'
            : '필드 수정에 실패했습니다.';
    throw new InquiryFieldApiError(res.status, message, messages);
  }

  return res.json() as Promise<InquiryField>;
}

/**
 * 문의 필드 삭제(DELETE). 인증 필요.
 * 성공 시 204(본문 없음). 미존재는 404.
 */
export async function deleteInquiryField(id: string): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/inquiry/fields/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  } catch {
    throw new InquiryFieldApiError(
      0,
      '네트워크 오류로 필드를 삭제하지 못했습니다.',
    );
  }

  if (!res.ok) {
    const message =
      res.status === 401 || res.status === 403
        ? '로그인이 필요합니다.'
        : res.status === 404
          ? '필드를 찾을 수 없습니다.'
          : '필드 삭제에 실패했습니다.';
    throw new InquiryFieldApiError(res.status, message);
  }
}
