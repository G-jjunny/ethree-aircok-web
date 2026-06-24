/**
 * 카탈로그(제품 책자) 한 페이지에 해당하는 이미지.
 * 공개 뷰어(2D/3D)와 어드민 관리 UI가 공유하는 도메인 모델이다.
 */
export interface CatalogImage {
  id: string;
  /** 이미지 원본 URL */
  imageUrl: string;
  /** 책자 내 페이지 순서(오름차순). 작을수록 앞 페이지. */
  order: number;
  createdAt?: string;
  updatedAt?: string;
}
