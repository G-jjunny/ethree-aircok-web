/**
 * MailSetting 싱글톤 기본값 상수.
 *
 * inquiry.service(lazy 생성/기본값 반환)와 mail.service(설정 없을 때 발송 fallback)
 * 양쪽이 동일한 기본 템플릿을 공유하도록 한 곳에서 정의해 import 한다.
 *
 * 템플릿 치환 변수: {{company}} {{name}} {{phone}} {{email}} {{message}}
 */

/** MailSetting 싱글톤 행의 고정 PK. */
export const MAIL_SETTING_ID = 'singleton';

/** 기본 메일 제목 템플릿. */
export const DEFAULT_SUBJECT_TEMPLATE = '[스마트에어콕] 새 문의가 접수되었습니다';

/** 기본 메일 본문 템플릿. */
export const DEFAULT_BODY_TEMPLATE = [
  '새 문의가 접수되었습니다.',
  '',
  '회사/기관명: {{company}}',
  '담당자명: {{name}}',
  '전화: {{phone}}',
  '이메일: {{email}}',
  '',
  '요청사항:',
  '{{message}}',
].join('\n');
