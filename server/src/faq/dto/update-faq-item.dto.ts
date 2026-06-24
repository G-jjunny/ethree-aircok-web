import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * FAQ 항목 수정 요청 바디 (부분 수정, 모든 필드 optional).
 *
 * - 전달된 필드만 갱신한다 (service 에서 undefined 체크).
 * - categoryId: 변경 시 존재 여부 재검증 — 없는 ID 전달 시 서비스에서 404 반환.
 * - answer: 빈 문자열 불허 (IsNotEmpty 적용).
 */
export class UpdateFaqItemDto {
  /** 카테고리 변경 시 대상 FaqCategory.id (cuid). */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  categoryId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  question?: string;

  /** 답변 텍스트. 줄바꿈/마크다운 허용. 전달 시 빈 문자열 불허. */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  answer?: string;

  /** 카테고리 내 표시 순서(오름차순). 미지정 시 기존 값 유지. */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  order?: number;
}
