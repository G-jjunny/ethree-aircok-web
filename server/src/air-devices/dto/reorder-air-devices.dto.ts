import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

/**
 * 드래그앤드롭 일괄 순서변경 단위 항목 (#services 1단계).
 *
 * - id: 변경 대상 AirDevice 의 cuid(string).
 * - order: 새 표시 순서(정수). 배열 인덱스 기반 0..n-1 값 전달 권장.
 */
export class ReorderAirDeviceItemDto {
  /** 변경 대상 AirDevice 의 id (cuid string). */
  @IsString()
  @IsNotEmpty()
  id: string;

  /** 새 표시 순서(정수, 오름차순). */
  @IsInt()
  @Min(0)
  order: number;
}

/**
 * PATCH /api/air-devices/reorder 요청 바디 (#services 1단계).
 *
 * Content-Type: application/json
 * - items: { id: string, order: number } 쌍의 배열.
 *   service 가 트랜잭션으로 각 레코드의 order 를 일괄 갱신한다.
 *
 * 라우트 등록 순서 주의: PATCH /api/air-devices/reorder 는 반드시
 * PATCH /api/air-devices/:id 보다 먼저 선언해야 한다. 그렇지 않으면
 * NestJS 라우터가 'reorder' 를 :id 로 매칭한다.
 *
 * 응답: 갱신된 **어드민 전체 배열**(미공개 포함, GET /api/air-devices/admin 과 동일 형태).
 * partners/core-values 는 reorder 후 findAll() 을 반환하지만, 그 모델들에는 published 가 없다.
 * AirDevice 는 published 가 있으므로 공개 findAll()(published=true 만)을 반환하면
 * 어드민 화면에서 미공개 카드가 사라진다 → 어드민 목록을 반환한다.
 *
 * 여기서 items 는 순서변경 대상 AirDevice 목록이며, AirDevice.items(측정 항목)와는 무관하다.
 */
export class ReorderAirDevicesDto {
  /** 순서변경 대상 항목 배열. 빈 배열 불가. */
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ReorderAirDeviceItemDto)
  items: ReorderAirDeviceItemDto[];
}
