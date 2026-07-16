/**
 * 공기질 측정기(AirDevice) 도메인 타입.
 * 백엔드 계약(AirDeviceResponseDto)과 1:1 매핑된다 — 필드 추가/삭제는 백엔드와 함께 변경한다.
 */

/**
 * 측정기의 측정 항목(예: { code: 'PM2.5', label: '초미세먼지' }).
 *
 * 주의: `id`는 부모 PATCH의 replace-all 정책상 재발급되므로 영속 키로 신뢰하지 않는다.
 * 렌더 시 React key 용도로만 사용한다.
 */
export interface AirDeviceItem {
  /** cuid. 부모 수정 시 재발급됨 — 영속 키로 사용 금지. */
  id: string;
  /** 부모 AirDevice의 id(cuid). */
  deviceId: string;
  /** 측정 항목 코드(예: 'PM2.5', 'CO₂'). */
  code: string;
  /** 측정 항목 한글명(예: '초미세먼지'). */
  label: string;
  /** 부모 내 표시 순서(오름차순). */
  order: number;
}

/**
 * 공기질 측정기 모델.
 *
 * 공개 GET /api/air-devices와 어드민 GET /api/air-devices/admin의 **필드 구성은 동일**하다.
 * 차이는 행 필터(공개는 published=true만)뿐이므로 단일 타입으로 양쪽을 다룬다.
 */
export interface AirDevice {
  /** cuid. */
  id: string;
  /** 모델명(예: 'SA-IL2 / SA-IEW'). */
  name: string;
  /** 모델 부제(예: '조달청 혁신제품 선정 모델'). */
  subtitle: string;
  /** 카드 뱃지 문구(예: '조달청 혁신제품'). */
  badge: string;
  /** 제품 사진 절대 URL. **미등록이 정상 케이스**이며 이때 null이다(소비 측 폴백 필수). */
  imageUrl: string | null;
  /** 크기 표시 문자열(예: '180 × 130 × 30 mm'). */
  size: string;
  /** 무게 표시 문자열(예: '270 g (LTE 포함 300 g)'). */
  weight: string;
  /** 전원 표시 문자열(예: '12V / 200mA'). */
  power: string;
  /** 통신 방식 표시 문자열(예: 'LTE / Ethernet / Wi-Fi 중 선택'). */
  comm: string;
  /** 저장 방식 표시 문자열(예: 'micro SD · 최장 3년'). */
  storage: string;
  /** 동작 온도 표시 문자열(예: '-10℃ ~ 60℃'). */
  operatingTemp: string;
  /** 표시 순서(오름차순). */
  order: number;
  /** 공개 여부. 공개 GET 응답에서는 항상 true. */
  published: boolean;
  /** 측정 항목 목록. order 오름차순. 항목이 없으면 빈 배열(null 아님). */
  items: AirDeviceItem[];
  /** ISO 8601 문자열. */
  createdAt: string;
  /** ISO 8601 문자열. */
  updatedAt: string;
}

/**
 * 측정 항목 **요청** 타입(POST/PATCH body의 items 요소).
 *
 * 응답 타입 {@link AirDeviceItem}과 달리 `code`/`label`만 보낸다.
 * 백엔드 ValidationPipe가 `forbidNonWhitelisted: true`이므로 `id`/`deviceId`를 실어 보내면 **400**이다.
 * `order`도 보내지 않는다 — 서버가 **배열 인덱스**로 채번하므로 전달 순서 = 표시 순서다.
 */
export interface AirDeviceItemInput {
  /** 측정 항목 코드(예: 'PM2.5'). 필수·최대 50자. */
  code: string;
  /** 측정 항목 한글명(예: '초미세먼지'). 필수·최대 100자. */
  label: string;
}

/**
 * 측정기 **생성** 요청 타입(POST /air-devices, JSON).
 *
 * 백엔드 CreateAirDeviceDto와 1:1 매핑된다.
 * - `imageUrl`은 **의도적으로 없다**. 제품 사진은 레코드 생성 후
 *   POST /air-devices/:id/image (multipart, 필드명 `file`)로 업로드한다.
 *   JSON body에 imageUrl을 넣으면 forbidNonWhitelisted로 **400**이다.
 * - `order` 미지정 시 맨 뒤(마지막 order + 1)로 자동 채번된다.
 * - `published` 미지정 시 true(등록 즉시 노출).
 * - `items` 미지정 시 빈 목록으로 생성된다.
 */
export interface AirDeviceInput {
  /** 모델명. 필수·최대 200자. */
  name: string;
  /** 모델 부제. 필수·최대 200자. */
  subtitle: string;
  /** 카드 뱃지 문구. 필수·최대 100자. */
  badge: string;
  /** 크기 표시 문자열. 필수·최대 100자. */
  size: string;
  /** 무게 표시 문자열. 필수·최대 100자. */
  weight: string;
  /** 전원 표시 문자열. 필수·최대 100자. */
  power: string;
  /** 통신 방식 표시 문자열. 필수·최대 200자. */
  comm: string;
  /** 저장 방식 표시 문자열. 필수·최대 100자. */
  storage: string;
  /** 동작 온도 표시 문자열. 필수·최대 100자. */
  operatingTemp: string;
  /** 표시 순서. 생략 권장(서버가 맨 뒤로 채번). */
  order?: number;
  /** 공개 여부. 생략 시 true. */
  published?: boolean;
  /** 측정 항목 배열. 생략 시 빈 목록. */
  items?: AirDeviceItemInput[];
}

/**
 * 측정기 **부분 수정** 요청 타입(PATCH /air-devices/:id, JSON).
 *
 * 전달한 필드만 갱신된다. `imageUrl`은 여기에도 없다(multipart 전용).
 *
 * ⚠️ `items`는 **replace-all(전체 교체)** 시맨틱이다:
 * - 미전달(undefined) → 기존 항목 **유지**
 * - 배열 전달 → 기존 항목 전부 삭제 후 전달 배열로 재생성
 * - `[]` 전달 → 항목 **전부 삭제**
 *
 * 이 때문에 자식 `AirDeviceItem.id`는 수정할 때마다 재발급된다 — 영속 키로 신뢰하지 않는다.
 */
export type AirDeviceUpdateInput = Partial<AirDeviceInput>;
