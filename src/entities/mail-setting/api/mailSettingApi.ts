import axios from 'axios';
import { queryOptions } from '@tanstack/react-query';
import {
  axiosInstance,
  ApiError,
  authAwareRetry,
  parseAxiosMessages,
} from '@/shared/api';
import type { MailSetting, UpdateMailSettingBody } from '../model/types';

/**
 * 이메일 설정 TanStack Query 키의 단일 출처(팩토리).
 * 싱글톤 리소스이므로 `all` 하나로 충분하다.
 */
export const mailSettingKeys = {
  all: ['mail-setting'] as const,
};

/**
 * 이메일 설정 API 호출 실패를 나타내는 에러.
 * 공통 판별(`isAuthError`/`isValidationError` 등)은 베이스 {@link ApiError}에서 제공한다.
 */
export class MailSettingApiError extends ApiError {}

/**
 * 이메일 설정 조회. 인증 필요(access_token 쿠키 — withCredentials: true).
 * 응답은 비래핑 단일 객체이며 백엔드가 행이 없으면 lazy 생성하므로 null이 오지 않는다.
 * (클라이언트 컴포넌트 전용 — 서버에서 호출하지 않는다.)
 */
export async function getMailSetting(): Promise<MailSetting> {
  try {
    const { data } = await axiosInstance.get<MailSetting>('/inquiry/mail-setting');
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const message =
        status === 401 || status === 403
          ? '로그인이 필요합니다.'
          : status === 0
            ? '네트워크 오류로 이메일 설정을 불러오지 못했습니다.'
            : '이메일 설정을 불러오는 데 실패했습니다.';
      throw new MailSettingApiError(status, message);
    }
    throw new MailSettingApiError(0, '네트워크 오류로 이메일 설정을 불러오지 못했습니다.');
  }
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
    retry: authAwareRetry,
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
  try {
    const { data } = await axiosInstance.put<MailSetting>('/inquiry/mail-setting', {
      recipientEmail: body.recipientEmail,
      subjectTemplate: body.subjectTemplate,
      bodyTemplate: body.bodyTemplate,
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
              ? '네트워크 오류로 이메일 설정을 저장하지 못했습니다.'
              : '이메일 설정 저장에 실패했습니다.';
      throw new MailSettingApiError(status, message, messages);
    }
    throw new MailSettingApiError(0, '네트워크 오류로 이메일 설정을 저장하지 못했습니다.');
  }
}
