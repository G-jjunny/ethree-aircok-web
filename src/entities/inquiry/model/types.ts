export type InquiryStatus = 'NEW' | 'IN_PROGRESS' | 'DONE';

export interface InquirySummary {
  id: string;
  company: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: InquiryStatus;
  createdAt: string; // ISO 8601
}

export interface InquiryListResponse {
  data: InquirySummary[];
  total: number;
  page: number;
  limit: number;
}

/** 공개 문의 제출 본문 — 백엔드 DTO와 1:1 (정확히 이 5개 키만 전송) */
export interface CreateInquiryBody {
  company: string;
  name: string;
  phone: string;
  email: string;
  message: string;
}
