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
 * 드래그앤드롭 일괄 순서변경 단위 항목 (#124 진단서비스 재설계 1단계).
 *
 * - id: 변경 대상 Certification 의 cuid(string).
 * - order: 새 표시 순서(정수). 배열 인덱스 기반 0..n-1 값 전달 권장.
 */
export class ReorderCertificationItemDto {
  /** 변경 대상 Certification 의 id (cuid string). */
  @IsString()
  @IsNotEmpty()
  id: string;

  /** 새 표시 순서(정수, 오름차순). */
  @IsInt()
  @Min(0)
  order: number;
}

/**
 * PATCH /api/certifications/reorder 요청 바디 (#124 진단서비스 재설계 1단계).
 *
 * Content-Type: application/json
 * - items: { id: string, order: number } 쌍의 배열.
 *   service 가 트랜잭션으로 각 레코드의 order 를 일괄 갱신한다.
 *
 * 라우트 등록 순서 주의: PATCH /api/certifications/reorder 는 반드시
 * PATCH /api/certifications/:id 보다 먼저 선언해야 한다(설계상 :id 업데이트
 * 라우트는 두지 않지만 reorder 가 :id 로 오인 매칭되지 않도록 컨벤션 유지).
 */
export class ReorderCertificationsDto {
  /** 순서변경 대상 항목 배열. 빈 배열 불가. */
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ReorderCertificationItemDto)
  items: ReorderCertificationItemDto[];
}
