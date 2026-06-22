import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

/**
 * 어드민 뉴스 수정 요청 바디 (부분 수정, 모든 필드 optional).
 *
 * Content-Type: application/json
 * - 전달된 필드만 갱신한다 (service 에서 undefined 체크).
 * - coverImage 는 POST /api/news/images (multipart, 필드명 `image`) 응답으로 받은
 *   URL 문자열로 교체한다. 파일 아님.
 *   (커버 이미지 제거 정책은 미확정 — unresolvedIssues 참고)
 * - content: 전달 시 빈 문자열 허용 (not-empty 검증 없음).
 * - published: JSON boolean.
 * - date: "YYYY-MM-DD" 권장(ISO 8601 datetime 문자열도 허용). service 에서 new Date() 파싱.
 */
export class UpdateNewsDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  /** 전달 시 빈 문자열 허용. */
  @IsOptional()
  @IsString()
  content?: string;

  /** 권장 포맷 "YYYY-MM-DD" (예: "2026-06-22"). ISO 8601 문자열도 허용. */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  date?: string;

  @IsOptional()
  @IsString()
  location?: string;

  /** 교체할 커버 이미지 URL (예: "/uploads/xxx.png"). 파일 업로드 아님. */
  @IsOptional()
  @IsString()
  coverImage?: string;

  /** 게시 여부. JSON boolean. 미지정 시 기존 값 유지. */
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
