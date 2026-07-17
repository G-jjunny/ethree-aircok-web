/**
 * 진단 서비스 후기(신청 사유) 1건.
 * 백엔드 공개 계약(GET /api/service-reviews)과 1:1 매핑된다.
 *
 * 주의: 공개 목록은 백엔드가 `published === true`만, `order ASC`로 정렬해 반환한다.
 * 프론트는 추가 정렬을 하지 않고 응답 순서를 그대로 렌더한다.
 */
export interface ServiceReview {
  /** cuid. */
  id: string;
  /** 신청 사유 인용문(카드 본문). */
  quote: string;
  /** 작성자 역할(예: "대표", "연구원"). */
  role: string;
  /** 작성자 나이 표기(예: "50세"). */
  age: string;
  /**
   * 원형 아바타 이미지 URL. **null 이 정상 케이스**다 — 미등록 시 이니셜/아이콘 폴백을 렌더한다.
   */
  imageUrl: string | null;
  /** 정렬 순서(오름차순). 백엔드가 정렬을 책임진다. */
  order: number;
  /** 공개 여부. 공개 목록에는 true 만 포함된다. */
  published: boolean;
  /** ISO 8601 문자열. */
  createdAt: string;
  /** ISO 8601 문자열. */
  updatedAt: string;
}
