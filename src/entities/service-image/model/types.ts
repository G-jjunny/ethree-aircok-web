/**
 * 제품군(서비스) 소개 이미지 한 항목의 도메인 모델.
 * 공개 services 페이지와 어드민 관리 UI가 공유한다.
 *
 * 백엔드(`service-image.controller.ts`) 응답에는 alt 컬럼이 없다.
 */
export interface ServiceImage {
  id: string;
  /** R2 절대 URL(http로 시작). */
  imageUrl: string;
  /** 표시 순서(오름차순). 작을수록 앞. */
  order: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 서버 응답 원본 형태.
 * 현재는 도메인 모델과 동일하나, 향후 응답/소비 분리 여지를 위해 별칭으로 둔다.
 */
export type ServiceImageResponse = ServiceImage;
