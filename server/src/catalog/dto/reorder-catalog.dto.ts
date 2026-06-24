import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

/**
 * 드래그앤드롭 일괄 순서변경 단위 항목 (#44).
 *
 * - id: 변경 대상 CatalogImage 의 cuid.
 * - order: 새 표시 순서(정수). 일반적으로 배열 인덱스 기반 0..n-1 값을 전달한다.
 */
export class ReorderItemDto {
  /** 변경 대상 CatalogImage 의 id (cuid). */
  @IsString()
  @IsNotEmpty()
  id: string;

  /** 새 표시 순서(정수, 오름차순). */
  @IsInt()
  order: number;
}

/**
 * 어드민 카탈로그 드래그앤드롭 일괄 순서변경 요청 바디 (#44).
 *
 * Content-Type: application/json
 * - items: { id, order } 쌍의 배열. service 가 트랜잭션으로 각 레코드의 order 를 일괄 갱신한다.
 * - 라우트 PATCH /api/catalog/reorder 는 PATCH /api/catalog/:id 보다 먼저 선언되어
 *   "reorder" 가 :id 로 매칭되지 않도록 한다(설계 노트 참고).
 */
export class ReorderCatalogDto {
  /** 순서변경 대상 항목 배열. 빈 배열 불가. */
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  items: ReorderItemDto[];
}
