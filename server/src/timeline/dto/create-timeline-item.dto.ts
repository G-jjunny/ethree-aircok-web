import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

/**
 * POST /api/timelines 요청 바디 (#57).
 *
 * - year, month, content 모두 필수.
 * - year: 2000~2100, month: 1~12 검증.
 */
export class CreateTimelineItemDto {
  /** 연도(정수). 2000~2100. */
  @IsInt()
  @Min(2000)
  @Max(2100)
  year: number;

  /** 월(정수). 1~12. */
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  /** 연혁 이벤트 설명. 비어있지 않은 문자열. */
  @IsString()
  @IsNotEmpty()
  content: string;
}
