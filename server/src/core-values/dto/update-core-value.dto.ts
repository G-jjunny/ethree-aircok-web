import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

/**
 * PATCH /api/core-values/:id 요청 바디 (#93).
 *
 * 부분 수정 DTO — 전달된 필드만 갱신한다. 모든 필드 optional.
 */
export class UpdateCoreValueDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
