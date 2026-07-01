import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

/**
 * POST /api/core-values 요청 바디 (#93).
 *
 * - title, description 은 필수.
 * - order 는 미지정 시 service 기본 정책(맨 뒤에 자동 채번) 적용.
 */
export class CreateCoreValueDto {
  /** 카드 제목(짧은 문구). */
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  /** 카드 설명 문구. */
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  /** 표시 순서(오름차순). 미지정 시 맨 뒤(마지막 order + 1)에 자동 채번. */
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
