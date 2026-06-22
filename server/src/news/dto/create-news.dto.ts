import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

/**
 * 어드민 뉴스 생성 요청 바디.
 *
 * Content-Type: application/json
 * - coverImage 는 POST /api/news/images (multipart, 필드명 `image`) 응답으로 받은
 *   URL 문자열(예: "/uploads/1781859080294-foo.png")을 그대로 전달한다. 파일이 아님.
 * - published 는 JSON boolean.
 * - content 는 필수 키지만 빈 문자열 허용 (not-empty 검증 없음).
 * - date 는 "YYYY-MM-DD" 권장(ISO 8601 datetime 문자열도 허용). service 에서 new Date() 파싱.
 */
export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  /** 필수 키지만 빈 문자열 허용. */
  @IsString()
  content: string;

  /** 권장 포맷 "YYYY-MM-DD" (예: "2026-06-22"). ISO 8601 문자열도 허용. */
  @IsString()
  @IsNotEmpty()
  date: string;

  @IsOptional()
  @IsString()
  location?: string;

  /** 이미 업로드된 커버 이미지 URL (예: "/uploads/xxx.png"). 파일 업로드 아님. */
  @IsOptional()
  @IsString()
  coverImage?: string;

  /** 게시 여부. JSON boolean, 미지정 시 기본값 false. */
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
