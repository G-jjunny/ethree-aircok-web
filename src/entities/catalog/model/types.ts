// TODO(contract): backend-leader 카탈로그 API 계약 확정 후 필드명 동기화
// News 패턴 기준 잠정 필드. 백엔드 DTO 확정 시 url/order/alt 명칭을 맞춘다.

/**
 * 카탈로그(제품 책자) 한 페이지에 해당하는 이미지.
 * 공개 뷰어(2D/3D)와 어드민 관리 UI가 공유하는 도메인 모델이다.
 */
export interface CatalogImage {
  id: string;
  /** 이미지 원본 URL */
  url: string;
  /** 책자 내 페이지 순서(오름차순). 작을수록 앞 페이지. */
  order: number;
  /** 대체 텍스트(접근성). 미지정 가능. */
  alt?: string;
  createdAt?: string;
}

/**
 * 카탈로그 이미지 목록 API 응답 envelope.
 * News 패턴(`{ data: [...] }`)을 따른다.
 */
export interface CatalogImageListResponse {
  data: CatalogImage[];
}
