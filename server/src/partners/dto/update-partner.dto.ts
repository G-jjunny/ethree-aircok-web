import { PartnerType } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

/**
 * PATCH /api/partners/:id 요청 바디 (#48).
 *
 * 부분 수정 DTO — 전달된 필드만 갱신한다. 모든 필드 optional.
 */
export class UpdatePartnerDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name?: string;

  /** null 을 명시적으로 전달하면 로고 제거. URL 문자열 전달 시 교체. */
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  logoUrl?: string | null;

  @IsOptional()
  @IsEnum(PartnerType)
  type?: PartnerType;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
