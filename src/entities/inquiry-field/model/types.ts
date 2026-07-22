export type InquiryFieldType = 'text' | 'textarea' | 'email' | 'tel';

/** 동적 문의 필드 정의 — 백엔드 계약 스키마와 1:1 */
export interface InquiryField {
  id: string;
  key: string;
  label: string;
  type: InquiryFieldType;
  required: boolean;
  placeholder: string | null;
  order: number;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/** 필드 생성 본문 — key는 슬러그(^[a-z][a-z0-9_]*$), placeholder/order는 선택 */
export interface CreateInquiryFieldBody {
  key: string;
  label: string;
  type: InquiryFieldType;
  required: boolean;
  placeholder?: string;
  order?: number;
}

/** 필드 수정 본문 — 전부 선택, key는 변경 불가(미포함) */
export interface UpdateInquiryFieldBody {
  label?: string;
  type?: InquiryFieldType;
  required?: boolean;
  placeholder?: string;
  order?: number;
}
