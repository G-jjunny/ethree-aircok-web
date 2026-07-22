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
 * 드래그앤드롭 일괄 순서변경 단위 항목 (#48).
 *
 * - id: 변경 대상 Partner 의 cuid(string).
 *   ※ 프론트엔드 초안의 number[] → string[] 로 변경 (cuid 기반 통일).
 * - order: 새 표시 순서(정수). 배열 인덱스 기반 0..n-1 값 전달 권장.
 */
export class ReorderPartnerItemDto {
  /** 변경 대상 Partner 의 id (cuid string). */
  @IsString()
  @IsNotEmpty()
  id: string;

  /** 새 표시 순서(정수, 오름차순). */
  @IsInt()
  @Min(0)
  order: number;
}

/**
 * PATCH /api/partners/reorder 요청 바디 (#48).
 *
 * Content-Type: application/json
 * - items: { id: string, order: number } 쌍의 배열.
 *   service 가 트랜잭션으로 각 레코드의 order 를 일괄 갱신한다.
 *
 * 라우트 등록 순서 주의: PATCH /api/partners/reorder 는 반드시
 * PATCH /api/partners/:id 보다 먼저 선언해야 한다. 그렇지 않으면
 * NestJS 라우터가 'reorder' 를 :id 로 매칭한다.
 *
 * 프론트엔드 초안과의 차이:
 * - 초안: { ids: number[] } — 단순 id 배열로 순서를 index 로 추론.
 * - 확정: { items: { id: string, order: number }[] } — id + order 명시적 쌍.
 *   이유: 기존 CatalogImage reorder 와 동일 패턴 통일. 부분 reorder(일부 항목만 변경)도 지원 가능.
 */
export class ReorderPartnersDto {
  /** 순서변경 대상 항목 배열. 빈 배열 불가. */
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ReorderPartnerItemDto)
  items: ReorderPartnerItemDto[];
}
