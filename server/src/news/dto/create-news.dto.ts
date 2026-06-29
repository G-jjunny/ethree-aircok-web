import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';
import { NewsType } from './news-type.enum';

/**
 * 어드민 뉴스 생성 요청 바디.
 *
 * Content-Type: application/json
 * - coverImage 는 POST /api/news/images (multipart, 필드명 `image`) 응답으로 받은
 *   URL 문자열(예: "/uploads/1781859080294-foo.png")을 그대로 전달한다. 파일이 아님.
 * - published 는 JSON boolean.
 * - date 는 "YYYY-MM-DD" 권장(ISO 8601 datetime 문자열도 허용). service 에서 new Date() 파싱.
 *
 * 타입별 필드 요건:
 * - type=BLOG (기본값): content 권장, externalUrl 무시.
 * - type=LINK: externalUrl 필수, content 선택(요약 목적으로 허용).
 */
export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  /**
   * 게시물 본문. BLOG 타입에서 사용.
   * LINK 타입에도 전달 가능하나 필수 아님. 빈 문자열 허용.
   */
  @IsOptional()
  @IsString()
  content?: string;

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

  /**
   * 뉴스 타입. 미지정 시 기본값 BLOG.
   * - BLOG: 본문(content) 기반 게시물.
   * - LINK: 외부 URL(externalUrl) 기반 게시물.
   */
  @IsOptional()
  @IsEnum(NewsType)
  type?: NewsType;

  /**
   * 외부 링크 URL. type=LINK 일 때 필수.
   * 유효한 URL 형식이어야 한다 (예: "https://example.com/article").
   */
  @ValidateIf((o) => o.type === NewsType.LINK)
  @IsNotEmpty()
  @IsUrl({}, { message: 'externalUrl must be a valid URL' })
  externalUrl?: string;
}
