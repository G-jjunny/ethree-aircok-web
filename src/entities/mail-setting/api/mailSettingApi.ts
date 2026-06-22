import { queryOptions } from '@tanstack/react-query';
import type { MailSetting, UpdateMailSettingBody } from '../model/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/**
 * 이메일 설정 TanStack Query 키의 단일 출처(팩토리).
 * 싱글톤 리소스이므로 `all` 하나로 충분하다.
 */
export const mailSettingKeys = {
  all: ['mail-setting'] as const,
};

/**
 * 이메일 설정 API 호출 실패를 나타내는 에러.
 * `status`로 인증 실패(401/403)와 검증 실패(400), 일반 실패를 구분한다.
 */
export class MailSettingApiError extends Error {
  readonly status: number;
  /** 검증 실패(400) 시 백엔드가 내려준 메시지 배열 */
  readonly messages?: string[];

  constructor(status: number, message: string, messages?: string[]) {
    super(message);
    this.name = 'MailSettingApiError';
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
}

/** 응답 본문에서 백엔드 검증 메시지 배열을 안전하게 추출한다. */
async function parseMessages(res: Response): Promise<string[] | undefined> {
  try {
    const data: unknown = await res.json();
    if (
      data &&
      typeof data === 'object' &&
      'message' in data &&
      Array.isArray((data as { message: unknown }).message)
    ) {
      return (data as { message: string[] }).message;
    }
  } catch {
    // 본문 파싱 실패는 무시 — 상태코드 기반으로 처리
  }
  return undefined;
}

/**
 * 이메일 설정 조회. 인증 필요(access_token 쿠키).
 * 응답은 비래핑 단일 객체이며 백엔드가 행이 없으면 lazy 생성하므로 null이 오지 않는다.
 * (클라이언트 컴포넌트 전용 — 서버에서 호출하지 않는다.)
 */
export async function getMailSetting(): Promise<MailSetting> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/inquiry/mail-setting`, {
      cache: 'no-store',
      credentials: 'include',
    });
  } catch {
    throw new MailSettingApiError(
      0,
      '네트워크 오류로 이메일 설정을 불러오지 못했습니다.',
    );
  }

  if (!res.ok) {
    const message =
      res.status === 401 || res.status === 403
        ? '로그인이 필요합니다.'
        : '이메일 설정을 불러오는 데 실패했습니다.';
    throw new MailSettingApiError(res.status, message);
  }

  return res.json() as Promise<MailSetting>;
}

/**
 * 이메일 설정 TanStack Query 옵션.
 * 인증 의존 데이터이므로 staleTime을 0으로 두고, 인증 실패(401/403)는 재시도하지 않는다.
 */
export function mailSettingQueryOptions() {
  return queryOptions({
    queryKey: mailSettingKeys.all,
    queryFn: getMailSetting,
    staleTime: 0,
    retry: (failureCount, error) => {
      if (error instanceof MailSettingApiError && error.isAuthError)
        return false;
      return failureCount < 1;
    },
  });
}

/**
 * 이메일 설정 수정(PUT). 인증 필요.
 * 정확히 { recipientEmail, subjectTemplate, bodyTemplate } 3개 키만 전송한다
 * (백엔드 ValidationPipe whitelist + forbidNonWhitelisted).
 * 성공 시 갱신 객체 전체(200)를 반환한다.
 */
export async function updateMailSetting(
  body: UpdateMailSettingBody,
): Promise<MailSetting> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/inquiry/mail-setting`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        recipientEmail: body.recipientEmail,
        subjectTemplate: body.subjectTemplate,
        bodyTemplate: body.bodyTemplate,
      }),
    });
  } catch {
    throw new MailSettingApiError(
      0,
      '네트워크 오류로 이메일 설정을 저장하지 못했습니다.',
    );
  }

  if (!res.ok) {
    const messages = await parseMessages(res);
    const message =
      res.status === 401 || res.status === 403
        ? '로그인이 필요합니다.'
        : res.status === 400
          ? '입력값을 다시 확인해 주세요.'
          : '이메일 설정 저장에 실패했습니다.';
    throw new MailSettingApiError(res.status, message, messages);
  }

  return res.json() as Promise<MailSetting>;
}
