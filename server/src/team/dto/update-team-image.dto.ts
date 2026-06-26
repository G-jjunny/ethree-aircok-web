import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * 에어콕 소개 OUR Team 섹션 이미지 레코드 수정 요청 바디 (#57).
 *
 * Content-Type: application/json
 * - 전달된 필드만 부분 갱신한다(undefined 인 필드는 변경하지 않음).
 * - imageUrl 은 POST /api/team-images/uploads 응답 URL 문자열을 전달한다(파일 아님).
 */
export class UpdateTeamImageDto {
  /** 업로드된 팀 이미지 URL (예: "/uploads/xxx.png"). 전달 시에만 갱신. */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  imageUrl?: string;

  /** 표시 순서(오름차순). 전달 시에만 갱신. */
  @IsOptional()
  @IsInt()
  order?: number;
}
