import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * 문의 알림 메일 설정(MailSetting) 수정 요청 바디 (어드민 전용, JwtAuthGuard).
 *
 * Content-Type: application/json
 * - PUT /api/inquiry/mail-setting 의 요청 바디.
 *
 * [전체 수정(PUT) 결정 근거]
 * - MailSetting 은 싱글톤 리소스이며 세 필드(recipientEmail/subjectTemplate/bodyTemplate)가
 *   하나의 일관된 "메일 설정" 단위로 함께 의미를 가진다. 부분 수정을 허용하면
 *   템플릿/수신자 조합의 정합성이 깨질 여지가 있고, 어드민 화면도 항상 세 필드를
 *   한 폼에서 함께 편집/제출하므로 전체 교체(PUT) 의미가 자연스럽다.
 * - 따라서 세 필드 모두 필수(@IsNotEmpty)로 두고 @IsOptional 을 쓰지 않는다.
 *
 * [ValidationPipe whitelist + forbidNonWhitelisted 정책 하 키 정책]
 * - 클라이언트가 보내도 되는 키: recipientEmail / subjectTemplate / bodyTemplate (이 3개만).
 * - 클라이언트가 보내면 400 으로 거부되는 키:
 *   id / createdAt / updatedAt (서버 관리 필드), 그 외 정의되지 않은 모든 키.
 * - recipientEmail 은 RFC 형식 검증(@IsEmail). 템플릿 두 필드는 빈 문자열 불가(@IsNotEmpty).
 *
 * [템플릿 치환 변수]
 * - subjectTemplate / bodyTemplate 안에서 다음 변수를 {{...}} 형태로 사용할 수 있다.
 *   {{company}} {{name}} {{phone}} {{email}} {{message}}
 * - 변수 유효성(허용 변수 외 사용)은 이 DTO 에서 강제하지 않으며, 발송 시 치환 로직이
 *   매핑되지 않는 토큰은 그대로 두거나 빈 문자열로 처리한다(구현자 결정 사항).
 */
export class UpdateMailSettingDto {
  /** 알림 메일 수신자 이메일. RFC 형식 검증. */
  @IsEmail()
  recipientEmail: string;

  /** 메일 제목 템플릿. {{...}} 치환 변수 포함 가능. 빈 문자열 불가. */
  @IsString()
  @IsNotEmpty()
  subjectTemplate: string;

  /** 메일 본문 템플릿. {{...}} 치환 변수 포함 가능. 빈 문자열 불가. */
  @IsString()
  @IsNotEmpty()
  bodyTemplate: string;
}
