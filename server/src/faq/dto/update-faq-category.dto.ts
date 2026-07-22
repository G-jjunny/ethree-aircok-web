import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * FAQ 카테고리 수정 요청 바디 (부분 수정, 모든 필드 optional).
 *
 * - 전달된 필드만 갱신한다 (service 에서 undefined 체크).
 * - name: 변경 시 유니크 제약 재검증 — 중복 시 서비스에서 409 Conflict 반환.
 */
export class UpdateFaqCategoryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  /** 표시 순서(오름차순). 미지정 시 기존 값 유지. */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  order?: number;
}
