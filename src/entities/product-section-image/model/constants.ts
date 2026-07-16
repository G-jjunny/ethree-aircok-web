/**
 * `/services` 페이지 섹션별 고정 이미지 슬롯 목록(단일 출처).
 *
 * 백엔드 Prisma enum `ProductImageSlot`과 **1:1로 동기화**되어야 한다.
 * 슬롯은 페이지 레이아웃상 위치가 고정된 이미지 자리이며, 슬롯당 최대 1장이다.
 * (order 컬럼이 없다 — 렌더 순서는 프론트 레이아웃이 결정한다.)
 *
 * 슬롯 추가/제거는 반드시 백엔드 마이그레이션과 함께 처리한다.
 */
export const PRODUCT_IMAGE_SLOTS = [
  /** 모니터링 섹션 — 대시보드. */
  'MONITORING_DASHBOARD',
  /** 모니터링 섹션 — 통계. */
  'MONITORING_STATS',
  /** 모니터링 섹션 — 기기. */
  'MONITORING_DEVICES',
  /** 모니터링 섹션 — DID. */
  'MONITORING_DID',
  /** 진단 서비스 섹션 — 방문. */
  'DIAGNOSIS_VISIT',
  /** 진단 서비스 섹션 — 분석. */
  'DIAGNOSIS_ANALYSIS',
  /** 진단 서비스 섹션 — 리포트. */
  'DIAGNOSIS_REPORT',
  /** 진단 서비스 섹션 — 제안. */
  'DIAGNOSIS_PROPOSAL',
  /** 블랙박스 섹션 — 제품 사진. */
  'KITCHEN_BLACKBOX_PRODUCT',
  /** 블랙박스 섹션 — 조리실 오염 현황 DID. */
  'KITCHEN_BLACKBOX_DID',
  /** 에어쉴드 섹션 — 특허 급기 기술. */
  'KITCHEN_AIRSHIELD_TECH',
] as const;
