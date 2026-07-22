import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

/**
 * POST /api/service-reviews 요청 바디 (#124 진단서비스 재설계 1단계).
 *
 * Content-Type: application/json (파일 업로드 아님)
 * - quote, role, age 는 필수(신청 이유 후기 카드).
 * - imageUrl 은 이 DTO 에 없다. 아바타 이미지는 레코드 생성 후
 *   POST /api/service-reviews/:id/image (multipart, 필드명 file) 로 업로드한다(air-devices 로고 패턴).
 *   전역 ValidationPipe 가 forbidNonWhitelisted: true 이므로 imageUrl 을 실어 보내면 400 이다.
 * - order 는 미지정 시 service 기본 정책(맨 뒤 = 마지막 order + 1 자동 채번) 적용.
 * - published 는 미지정 시 Prisma 기본값 true(등록 즉시 노출).
 */
export class CreateServiceReviewDto {
  /** 인용문(신청 이유, 고객 후기 본문). */
  @IsString()
  @IsNotEmpty()
  quote: string;

  /** 역할/직함(예: "대표", "연구원"). */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  role: string;

  /** 나이 표시 문자열(예: "50세"). 자유 문자열이라 "MZ세대" 같은 값도 허용. */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  age: string;

  /** 표시 순서(오름차순). 미지정 시 맨 뒤(마지막 order + 1)에 자동 채번. */
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  /** 공개 여부. 미지정 시 true(등록 즉시 노출). */
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
