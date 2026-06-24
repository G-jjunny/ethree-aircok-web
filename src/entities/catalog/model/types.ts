/**
 * 카탈로그(제품 책자) 한 항목에 해당하는 도메인 모델.
 * 공개 뷰어(2D/3D)와 어드민 관리 UI가 공유한다.
 *
 * 한 항목은 단일 이미지 파일(`fileType: 'image'`) 또는
 * 여러 페이지를 담은 PDF 파일(`fileType: 'pdf'`)일 수 있다.
 * 소비 측은 `fileType`으로 렌더링 방식을 분기한다.
 */
export interface CatalogImage {
  id: string;
  /**
   * 실제 파일 URL(상대 경로, 예: `/uploads/xxx.pdf`).
   *
   * 서버 응답은 `fileUrl: string | null`(legacy 항목은 null)일 수 있으나,
   * 신규 항목은 항상 채워지며 소비 측 단순화를 위해 모델에서는 `string`으로 정의한다.
   * 파싱 단계에서 null 항목은 안전하게 걸러낸다.
   */
  fileUrl: string;
  /** 파일 종류. 'image'면 단일 이미지, 'pdf'면 다중 페이지 PDF. (소문자) */
  fileType: 'image' | 'pdf';
  /** 책자 내 항목 순서(오름차순). 작을수록 앞 페이지. */
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 서버 응답 원본 형태.
 * `fileUrl`은 legacy 항목에서 null일 수 있고, `imageUrl`은 legacy 필드(무시).
 * queryFn에서 이 형태를 받아 안전하게 {@link CatalogImage}로 정규화한다.
 */
export interface CatalogImageResponse {
  id: string;
  /** @deprecated legacy 전용 — 신규는 null. 사용하지 않는다. */
  imageUrl?: string | null;
  fileUrl: string | null;
  fileType: 'image' | 'pdf';
  order: number;
  createdAt?: string;
  updatedAt?: string;
}
