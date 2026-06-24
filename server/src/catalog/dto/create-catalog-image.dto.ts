import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * 어드민 카탈로그 이미지 레코드 생성 요청 바디 (#44).
 *
 * Content-Type: application/json
 * - imageUrl 는 POST /api/catalog/images (multipart, 필드명 `image`) 응답으로 받은
 *   URL 문자열(예: "/uploads/1781859080294-foo.png")을 그대로 전달한다. 파일이 아님.
 * - order 는 미지정 시 service 기본 정책(예: 맨 뒤 append)을 따른다. Prisma 기본값 0.
 */
export class CreateCatalogImageDto {
  /** 업로드된 카탈로그 이미지 URL (예: "/uploads/xxx.png"). 파일 업로드 아님. */
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  /** 표시 순서(오름차순). 미지정 시 service 기본 정책 적용. */
  @IsOptional()
  @IsInt()
  order?: number;
}
