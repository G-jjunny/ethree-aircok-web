import { isAxiosError } from 'axios';

/**
 * 모든 도메인 API 에러의 베이스 클래스.
 * HTTP 상태코드 기반 공통 판별(인증/검증/충돌 등)을 제공한다.
 * 각 도메인(entities/\*\/api)은 이 클래스를 상속해 슬라이스별 `instanceof` 분기와
 * 도메인 특화 메시지만 추가한다 — 공통 "메커니즘"은 여기 한 곳에서 관리한다.
 */
export class ApiError extends Error {
  readonly status: number;
  /** 검증 실패(400) 시 백엔드(NestJS ValidationPipe)가 내려준 메시지 배열 */
  readonly messages?: string[];

  constructor(status: number, message: string, messages?: string[]) {
    super(message);
    // 서브클래스로 생성하면 해당 클래스명이 자동으로 잡힌다(예: MapSettingApiError).
    this.name = new.target.name;
    this.status = status;
    this.messages = messages;
  }

  /** 인증/인가 실패 (401/403) — 로그인 필요 */
  get isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }

  /** 검증 실패 (400) */
  get isValidationError(): boolean {
    return this.status === 400;
  }

  /** 리소스 미존재 (404) */
  get isNotFound(): boolean {
    return this.status === 404;
  }

  /** 충돌 — 예: key 중복 (409) */
  get isConflict(): boolean {
    return this.status === 409;
  }

  /** 요청 과다 — Throttler (429) */
  get isRateLimited(): boolean {
    return this.status === 429;
  }
}

/**
 * axios 에러 응답 본문에서 백엔드 검증 메시지를 안전하게 추출한다.
 * NestJS ValidationPipe는 message를 string 또는 string[]로 내려주므로
 * 둘 다 string[]로 정규화한다.
 */
export function parseAxiosMessages(data: unknown): string[] | undefined {
  if (data && typeof data === 'object' && 'message' in data) {
    const rawMessages = (data as { message: unknown }).message;
    if (Array.isArray(rawMessages)) return rawMessages as string[];
    if (typeof rawMessages === 'string') return [rawMessages];
  }
  return undefined;
}

/**
 * TanStack Query 공용 retry 정책.
 * 인증 실패(401/403)는 재시도하지 않고, 그 외에는 1회까지만 재시도한다.
 * queryOptions의 `retry`에 그대로 전달한다.
 */
export function authAwareRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && error.isAuthError) return false;
  return failureCount < 1;
}

/**
 * axios 에러 응답에서 서버 메시지를 추출하고, 없으면 fallback을 반환한다.
 * 업로드 컴포넌트의 catch 블록에서 toast.error() 메시지 생성에 사용한다.
 */
export function extractUploadError(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object' && 'message' in data) {
      const raw = (data as { message: unknown }).message;
      if (typeof raw === 'string' && raw.length > 0) return raw;
      if (Array.isArray(raw) && raw.length > 0 && typeof raw[0] === 'string') return raw[0];
    }
  }
  return fallback;
}
