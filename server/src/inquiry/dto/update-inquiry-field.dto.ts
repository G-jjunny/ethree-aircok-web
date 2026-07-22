import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

/**
 * 문의하기 동적 폼 필드 부분 수정 요청 바디 (어드민 전용, JwtAuthGuard).
 *
 * Content-Type: application/json
 * - PATCH /api/inquiry/fields/:id 의 요청 바디.
 * - 모든 필드가 선택(@IsOptional) — 보낸 필드만 갱신한다.
 * - key 는 의도적으로 제외한다(생성 후 변경 불가). key 를 바디에 보내면
 *   forbidNonWhitelisted 정책상 400 으로 거부된다.
 * - id / createdAt / updatedAt 도 보낼 수 없다(미정의 키 → 400).
 */
export class UpdateInquiryFieldDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  label?: string;

  @IsOptional()
  @IsString()
  @IsIn(['text', 'textarea', 'email', 'tel'])
  type?: string;

  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsOptional()
  @IsString()
  placeholder?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
