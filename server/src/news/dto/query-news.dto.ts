import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { NewsType } from './news-type.enum';

/**
 * 공개 뉴스 목록(GET /api/news) 쿼리 파라미터.
 *
 * 전역 ValidationPipe 는 { whitelist, forbidNonWhitelisted, transform } 로 동작하며
 * enableImplicitConversion 이 꺼져 있으므로, 쿼리 문자열(숫자)은 반드시
 * @Type(() => Number) 로 명시적으로 변환한다.
 *
 * 필터 적용 규칙(service 담당):
 * - search / type 이 지정되면 where 조건에 AND 로 누적된다.
 * - 응답의 total 은 필터가 적용된 전체 매칭 수(현재 page 의 개수가 아님)이다.
 * - published: true 조건은 공개 목록에서 항상 강제된다(DTO 로 제어 불가).
 */
export class QueryNewsDto {
  /**
   * 페이지 번호(1-base). 기본값 1, 최소 1.
   * 문자열 "1" → 숫자 1 로 변환 후 정수/최소값 검증.
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  /**
   * 페이지당 항목 수. 기본값 10, 허용 범위 1~100.
   * DTO 에서 상한(100)을 검증하되, service 에서도 방어적으로 clamp 를 유지한다.
   */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  /**
   * 검색어. title 또는 description 에 대한 부분일치(대소문자 무시).
   * 앞뒤 공백은 여기서 trim 하며, 빈 문자열이면 service 에서 필터 미적용.
   */
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  search?: string;

  /**
   * 뉴스 타입 필터. 대문자 'BLOG' | 'LINK'.
   * 미지정 시 전체(BLOG + LINK) 반환.
   */
  @IsOptional()
  @IsEnum(NewsType)
  type?: NewsType;
}
