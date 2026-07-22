import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * FAQ 카테고리 생성 요청 바디.
 *
 * - name: 카테고리명. 유니크 제약 — 중복 시 서비스에서 409 Conflict 반환.
 * - order: 목록 표시 순서(오름차순). 미지정 시 0.
 */
export class CreateFaqCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  /** 표시 순서(오름차순). 미지정 시 기본값 0. */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  order?: number;
}
