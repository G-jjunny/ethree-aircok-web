import { IsNotEmpty, IsString } from 'class-validator';

/**
 * 문의하기 지도 주소 설정(MapSetting) 수정 요청 바디 (어드민 전용, JwtAuthGuard).
 *
 * Content-Type: application/json
 * - PUT /api/inquiry/map-setting 의 요청 바디.
 *
 * [전체 수정(PUT) 결정 근거]
 * - MapSetting 은 단일 필드(address)만 가지는 싱글톤 리소스이므로 전체 교체(PUT)
 *   의미가 그대로 자연스럽다. 부분 수정의 여지가 없어 @IsOptional 을 쓰지 않는다.
 *
 * [ValidationPipe whitelist + forbidNonWhitelisted 정책 하 키 정책]
 * - 클라이언트가 보내도 되는 키: address (이 1개만).
 * - 클라이언트가 보내면 400 으로 거부되는 키:
 *   id / createdAt / updatedAt (서버 관리 필드), 그 외 정의되지 않은 모든 키.
 * - address 는 빈 문자열 불가(@IsNotEmpty).
 */
export class UpdateMapSettingDto {
  /** 지도에 표시할 주소 문자열. 빈 문자열 불가. */
  @IsString()
  @IsNotEmpty()
  address: string;
}
