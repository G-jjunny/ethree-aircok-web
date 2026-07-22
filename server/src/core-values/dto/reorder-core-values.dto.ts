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
 * 드래그앤드롭 일괄 순서변경 단위 항목 (#93).
 *
 * - id: 변경 대상 CoreValue 의 cuid(string).
 * - order: 새 표시 순서(정수). 배열 인덱스 기반 0..n-1 값 전달 권장.
 */
export class ReorderCoreValueItemDto {
  /** 변경 대상 CoreValue 의 id (cuid string). */
  @IsString()
  @IsNotEmpty()
  id: string;

  /** 새 표시 순서(정수, 오름차순). */
  @IsInt()
  @Min(0)
  order: number;
}

/**
 * PATCH /api/core-values/reorder 요청 바디 (#93).
 *
 * Content-Type: application/json
 * - items: { id: string, order: number } 쌍의 배열.
 *   service 가 트랜잭션으로 각 레코드의 order 를 일괄 갱신한다.
 *
 * 라우트 등록 순서 주의: PATCH /api/core-values/reorder 는 반드시
 * PATCH /api/core-values/:id 보다 먼저 선언해야 한다. 그렇지 않으면
 * NestJS 라우터가 'reorder' 를 :id 로 매칭한다.
 */
export class ReorderCoreValuesDto {
  /** 순서변경 대상 항목 배열. 빈 배열 불가. */
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ReorderCoreValueItemDto)
  items: ReorderCoreValueItemDto[];
}
