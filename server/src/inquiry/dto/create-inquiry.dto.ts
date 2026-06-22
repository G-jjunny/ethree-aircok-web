import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * 문의하기(Inquiry) 생성 요청 바디 (공개 엔드포인트).
 *
 * Content-Type: application/json
 * - POST /api/inquiry (인증 불필요) 의 요청 바디.
 * - status / id / createdAt / updatedAt 은 클라이언트가 보내지 않는다.
 *   status 는 생성 시 백엔드가 항상 "NEW" 으로 고정한다.
 * - ValidationPipe 의 whitelist + forbidNonWhitelisted 정책상,
 *   여기 정의되지 않은 키(예: status)를 보내면 400 으로 거부된다.
 * - email 은 RFC 형식 검증(@IsEmail). 나머지는 빈 문자열 불가(@IsNotEmpty).
 */
export class CreateInquiryDto {
  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
