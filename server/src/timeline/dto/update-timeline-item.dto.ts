import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

/**
 * PATCH /api/timelines/:id 요청 바디 (#57).
 *
 * 부분 수정 DTO — 전달된 필드만 갱신한다. 모든 필드 optional.
 */
export class UpdateTimelineItemDto {
  /** 연도(정수). 2000~2100. */
  @IsOptional()
  @IsInt()
  @Min(2000)
  @Max(2100)
  year?: number;

  /** 월(정수). 1~12. */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  /** 연혁 이벤트 설명. 비어있지 않은 문자열. */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;
}
