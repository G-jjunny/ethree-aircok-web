import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * FAQ 항목 생성 요청 바디.
 *
 * - categoryId: FaqCategory.id (cuid). 존재하지 않는 ID 전달 시 서비스에서 404 반환.
 * - question: 질문 텍스트.
 * - answer: 답변 텍스트. 줄바꿈/마크다운 포함 가능. DB 컬럼은 @db.Text.
 * - order: 카테고리 내 표시 순서(오름차순). 미지정 시 0.
 */
export class CreateFaqItemDto {
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  question: string;

  /** 답변 텍스트. 줄바꿈/마크다운 허용. */
  @IsString()
  @IsNotEmpty()
  answer: string;

  /** 카테고리 내 표시 순서(오름차순). 미지정 시 기본값 0. */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  order?: number;
}
