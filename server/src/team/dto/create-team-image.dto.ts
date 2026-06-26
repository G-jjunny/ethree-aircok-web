import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * 에어콕 소개 OUR Team 섹션 이미지 레코드 생성 요청 바디 (#57).
 *
 * Content-Type: application/json
 * - imageUrl 는 POST /api/team-images/uploads (multipart, 필드명 `file`) 응답으로 받은
 *   URL 문자열(예: "/uploads/1781859080294-team.png")을 그대로 전달한다. 파일이 아님.
 * - order 는 미지정 시 service 기본 정책(맨 뒤 append)을 따른다. Prisma 기본값 0.
 * - 최대 3개 제한은 service 레이어에서 강제한다(이미 3개면 400).
 */
export class CreateTeamImageDto {
  /** 업로드된 팀 이미지 URL (예: "/uploads/xxx.png"). 파일 업로드 아님. */
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  /** 표시 순서(오름차순). 미지정 시 service 기본 정책 적용. */
  @IsOptional()
  @IsInt()
  order?: number;
}
