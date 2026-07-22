export type InquiryStatus = 'NEW' | 'IN_PROGRESS' | 'DONE';

/**
 * 어드민 문의 목록 행.
 * 신규 접수는 `answers`(key→값)에 데이터가 담기고 고정 컬럼은 null이다.
 * 과거(legacy) 데이터는 고정 컬럼(company/name/phone/email/message)에 값이 있다.
 */
export interface InquirySummary {
  id: string;
  answers: Record<string, string>;
  status: InquiryStatus;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  company?: string | null;
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  message?: string | null;
}

export interface InquiryListResponse {
  data: InquirySummary[];
  total: number;
  page: number;
  limit: number;
}

/**
 * 공개 문의 제출 본문 — 백엔드 DTO와 1:1.
 * 동적 필드 key를 키로 갖는 답변 맵만 전송한다(최상위 다른 키 금지).
 */
export interface CreateInquiryBody {
  answers: Record<string, string>;
}

export interface InquiryCountResponse {
  count: number;
}
