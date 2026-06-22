/**
 * 문의 알림 이메일 설정 (싱글톤).
 * 백엔드 응답과 1:1 — GET·PUT 응답 스키마 동일, id는 항상 "singleton".
 */
export interface MailSetting {
  id: string; // 항상 "singleton"
  recipientEmail: string;
  subjectTemplate: string;
  bodyTemplate: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/**
 * 이메일 설정 수정 본문 — 백엔드 DTO와 1:1 (정확히 이 3개 키만 전송).
 * id 등 다른 키를 보내면 백엔드가 forbidNonWhitelisted로 400 거부한다.
 */
export interface UpdateMailSettingBody {
  recipientEmail: string;
  subjectTemplate: string;
  bodyTemplate: string;
}
