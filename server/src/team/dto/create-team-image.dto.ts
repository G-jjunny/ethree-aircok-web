import { IsNotEmpty, IsString } from 'class-validator';

/**
 * 에어콕 소개 OUR Team 섹션 이미지 레코드 생성 요청 바디.
 *
 * Content-Type: application/json
 * - imageUrl 는 POST /api/team-images/uploads (multipart, 필드명 `file`) 응답으로 받은
 *   URL 문자열(예: "/uploads/1781859080294-team.png")을 그대로 전달한다. 파일이 아님.
 * - 단일 이미지 대체(replace) 방식: 기존 이미지가 있으면 해당 레코드를 새 URL로 업데이트한다.
 * - order 는 항상 0으로 고정되므로 요청 바디에 포함하지 않는다.
 */
export class CreateTeamImageDto {
  /** 업로드된 팀 이미지 URL (예: "/uploads/xxx.png"). 파일 업로드 아님. */
  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}
