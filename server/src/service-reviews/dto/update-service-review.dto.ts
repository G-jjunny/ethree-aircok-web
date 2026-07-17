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
 * PATCH /api/service-reviews/:id 요청 바디 (#124 진단서비스 재설계 1단계).
 *
 * 부분 수정 DTO — 전달된 필드만 갱신한다. 모든 필드 optional.
 * Content-Type: application/json (파일 업로드 아님)
 *
 * imageUrl 은 이 DTO 에 없다. 아바타 이미지 교체는 POST /api/service-reviews/:id/image
 * (multipart, 필드명 file)를 사용한다. 전역 ValidationPipe 가 forbidNonWhitelisted: true 이므로
 * imageUrl 을 실어 보내면 400 이다.
 *
 * order 단일 변경도 가능하나, 드래그앤드롭 일괄 순서변경은 PATCH /api/service-reviews/reorder 를 사용한다.
 */
export class UpdateServiceReviewDto {
  /** 변경할 인용문. 미지정 시 기존 값 유지. */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  quote?: string;

  /** 변경할 역할/직함. 미지정 시 기존 값 유지. */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  role?: string;

  /** 변경할 나이 표시 문자열. 미지정 시 기존 값 유지. */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  age?: string;

  /** 변경할 표시 순서(오름차순). 미지정 시 기존 값 유지. */
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  /** 변경할 공개 여부. 미지정 시 기존 값 유지. */
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
