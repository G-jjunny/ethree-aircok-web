import { CatalogFileType } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * 어드민 카탈로그 파일(이미지/PDF) 수정 요청 바디 (부분 수정, 모든 필드 optional) (#44).
 *
 * Content-Type: application/json
 * - 전달된 필드만 갱신한다 (service 에서 undefined 체크).
 * - fileUrl 는 POST /api/catalog/uploads (multipart, 필드명 `file`) 응답으로 받은
 *   URL 문자열로 파일을 교체한다. 파일 아님.
 * - fileType 은 image | pdf. fileUrl 교체 시 함께 갱신한다.
 * - order 단일 변경도 가능하나, 드래그앤드롭 일괄 순서변경은 PATCH /api/catalog/reorder 를 사용한다.
 */
export class UpdateCatalogImageDto {
  /** 교체할 카탈로그 파일 URL (예: "/uploads/xxx.pdf"). 파일 업로드 아님. */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  fileUrl?: string;

  /** 변경할 파일 종류(image | pdf). 미지정 시 기존 값 유지. */
  @IsOptional()
  @IsEnum(CatalogFileType)
  fileType?: CatalogFileType;

  /** 변경할 표시 순서(오름차순). 미지정 시 기존 값 유지. */
  @IsOptional()
  @IsInt()
  order?: number;
}
