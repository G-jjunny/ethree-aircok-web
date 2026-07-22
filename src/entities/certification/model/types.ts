/**
 * 인증서·특허증 1건.
 * 백엔드 공개 계약(GET /api/certifications)과 1:1 매핑된다.
 *
 * 주의: 공개 목록은 백엔드가 `order ASC`로 정렬해 반환한다.
 * 프론트는 추가 정렬을 하지 않고 응답 순서를 그대로 렌더한다.
 */
export interface Certification {
  /** cuid. */
  id: string;
  /** 인증서·특허증 이미지 절대 URL. 행이 존재하면 non-null. */
  imageUrl: string;
  /** 정렬 순서(오름차순). 백엔드가 정렬을 책임진다. */
  order: number;
  /** ISO 8601 문자열. */
  createdAt: string;
  /** ISO 8601 문자열. */
  updatedAt: string;
}
