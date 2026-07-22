import { CatalogFileType } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * 어드민 카탈로그 파일(이미지/PDF) 레코드 생성 요청 바디 (#44).
 *
 * Content-Type: application/json
 * - fileUrl 는 POST /api/catalog/uploads (multipart, 필드명 `file`) 응답으로 받은
 *   URL 문자열(예: "/uploads/1781859080294-foo.pdf")을 그대로 전달한다. 파일이 아님.
 * - fileType 은 업로드 응답의 fileType('image' | 'pdf')을 그대로 전달한다.
 * - order 는 미지정 시 service 기본 정책(맨 뒤 append)을 따른다. Prisma 기본값 0.
 */
export class CreateCatalogImageDto {
  /** 업로드된 카탈로그 파일 URL (예: "/uploads/xxx.pdf"). 파일 업로드 아님. */
  @IsString()
  @IsNotEmpty()
  fileUrl: string;

  /** 파일 종류(image | pdf). 업로드 응답 fileType 값. */
  @IsEnum(CatalogFileType)
  fileType: CatalogFileType;

  /** 표시 순서(오름차순). 미지정 시 service 기본 정책 적용. */
  @IsOptional()
  @IsInt()
  order?: number;
}
