import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

/**
 * 문의하기 동적 폼 필드 생성 요청 바디 (어드민 전용, JwtAuthGuard).
 *
 * Content-Type: application/json
 * - POST /api/inquiry/fields 의 요청 바디.
 * - id / createdAt / updatedAt 은 서버가 생성하므로 클라이언트가 보내지 않는다.
 * - key 는 생성 후 변경 불가(UpdateInquiryFieldDto 에서 제외). 메일 템플릿 치환 변수
 *   및 Inquiry.answers 키로 사용되므로 슬러그 규칙을 강제한다.
 * - ValidationPipe whitelist + forbidNonWhitelisted 정책상 정의되지 않은 키는 400.
 */
export class CreateInquiryFieldDto {
  /**
   * 필드 슬러그(answers 키 / 메일 치환 변수). 유니크.
   * 영소문자로 시작, 이후 영소문자/숫자/언더스코어만 허용.
   * 이미 존재하는 key 면 서비스가 409(Conflict)로 거부한다.
   */
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z][a-z0-9_]*$/, {
    message:
      'key 는 영소문자로 시작하고 영소문자/숫자/언더스코어만 사용할 수 있습니다.',
  })
  key: string;

  /** 폼에 표시되는 레이블. */
  @IsString()
  @IsNotEmpty()
  label: string;

  /** 필드 유형. 허용값: text | textarea | email | tel. */
  @IsString()
  @IsIn(['text', 'textarea', 'email', 'tel'])
  type: string;

  /** 필수 입력 여부. 미지정 시 서비스 기본값(true) 적용. */
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  /** 입력 안내 문구(선택). */
  @IsOptional()
  @IsString()
  placeholder?: string;

  /** 폼 내 표시 순서(오름차순). 미지정 시 서비스가 마지막 순서로 배치 권장. */
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
