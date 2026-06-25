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
 * POST /api/partners 요청 바디 (#48).
 *
 * - name, type 은 필수.
 * - logoUrl 은 선택. POST /api/partners/:id/logo 업로드 응답 URL 값을 사용 권장.
 * - order 는 미지정 시 service 기본 정책(0) 적용.
 */
export class CreatePartnerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  /**
   * 로고 이미지 URL. POST /api/partners/:id/logo 응답 url 값.
   * 미지정 시 null. 생성 후 로고 업로드 → PATCH 로 갱신하는 흐름도 허용.
   */
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  logoUrl?: string;

  /** 파트너 구분. 'partner' | 'client'. */
  @IsEnum(PartnerType)
  type: PartnerType;

  /** 표시 순서(오름차순). 미지정 시 기본값 0. */
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
