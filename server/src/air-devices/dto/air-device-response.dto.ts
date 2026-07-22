/**
 * AirDeviceItem(측정 항목) 응답 DTO (#services 1단계).
 *
 * AirDeviceResponseDto.items 의 요소. 항상 order 오름차순으로 정렬되어 반환된다.
 *
 * 주의: id 는 replace-all 정책상 부모 PATCH 마다 재발급된다.
 * 프론트는 이 id 를 영속 키(로컬 상태 매칭 등)로 신뢰하지 말고, 렌더 시 React key 정도로만 사용한다.
 */
export class AirDeviceItemResponseDto {
  /** cuid 문자열. 부모 수정 시 재발급됨. */
  id: string;
  /** 부모 AirDevice 의 id (cuid). */
  deviceId: string;
  /** 측정 항목 코드(예: "PM2.5", "CO₂"). */
  code: string;
  /** 측정 항목 한글명(예: "초미세먼지"). */
  label: string;
  /** 부모 내 표시 순서(오름차순). */
  order: number;
}

/**
 * AirDevice 응답 DTO (#services 1단계).
 *
 * 공통 응답 타입:
 * - GET /api/air-devices (배열, published=true 만)
 * - GET /api/air-devices/admin (배열, 미공개 포함 전체)
 * - POST /api/air-devices (단건)
 * - PATCH /api/air-devices/:id (단건)
 * - PATCH /api/air-devices/reorder (배열, 어드민 전체)
 * - POST /api/air-devices/:id/image (단건)
 *
 * 필드 노출 정책:
 * - 공개 GET 과 어드민 GET 의 **필드 구성은 동일**하다(published/createdAt/updatedAt 포함).
 *   차이는 필드가 아니라 행 필터(published=true 여부)뿐이다.
 * - 기존 모듈(partners/core-values/catalog)이 Prisma 행 전체를 그대로 반환하고,
 *   news 는 공개 목록 select 에도 published 를 포함하는 것과 일관된 정책이다.
 * - published 는 민감정보가 아니며(공개 응답에는 항상 true), 프론트가 단일 타입으로
 *   공개/어드민 응답을 모두 다룰 수 있게 한다.
 *
 * items 는 항상 include 되며 order 오름차순으로 정렬된다(빈 배열 가능, null 아님).
 */
export class AirDeviceResponseDto {
  /** cuid 문자열. */
  id: string;
  /** 모델명(예: "SA-IL2 / SA-IEW"). */
  name: string;
  /** 모델 부제(예: "조달청 혁신제품 선정 모델"). */
  subtitle: string;
  /** 카드 뱃지 문구(예: "조달청 혁신제품"). */
  badge: string;
  /** 제품 사진 R2 절대 URL. 미등록 시 null. */
  imageUrl: string | null;
  /** 크기 표시 문자열(예: "180 × 130 × 30 mm"). */
  size: string;
  /** 무게 표시 문자열(예: "270 g (LTE 포함 300 g)"). */
  weight: string;
  /** 전원 표시 문자열(예: "12V / 200mA"). */
  power: string;
  /** 통신 방식 표시 문자열(예: "LTE / Ethernet / Wi-Fi 중 선택"). */
  comm: string;
  /** 저장 방식 표시 문자열(예: "micro SD · 최장 3년"). */
  storage: string;
  /** 동작 온도 표시 문자열(예: "-10℃ ~ 60℃"). */
  operatingTemp: string;
  /** 표시 순서(오름차순). */
  order: number;
  /** 공개 여부. 공개 GET 응답에서는 항상 true. */
  published: boolean;
  /** 측정 항목 목록. order 오름차순. 항목 없으면 빈 배열. */
  items: AirDeviceItemResponseDto[];
  /** ISO 8601 문자열. */
  createdAt: string;
  /** ISO 8601 문자열. */
  updatedAt: string;
}
