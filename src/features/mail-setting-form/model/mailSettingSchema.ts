import { z } from 'zod';

/**
 * 이메일 설정 폼 스키마.
 * 백엔드 DTO와 1:1 (recipientEmail, subjectTemplate, bodyTemplate).
 */
export const mailSettingSchema = z.object({
  recipientEmail: z
    .string()
    .min(1, '수신 이메일을 입력하세요')
    .email('올바른 이메일 형식이 아닙니다'),
  subjectTemplate: z.string().min(1, '제목 템플릿을 입력하세요'),
  bodyTemplate: z.string().min(1, '본문 템플릿을 입력하세요'),
});

export type MailSettingFormValues = z.infer<typeof mailSettingSchema>;
