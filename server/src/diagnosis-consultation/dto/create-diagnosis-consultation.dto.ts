import { IsNotEmpty, IsString, Matches } from 'class-validator';

/** 진단 상담 신청 생성 요청 바디 (공개 엔드포인트). */
export class CreateDiagnosisConsultationDto {
  /** 신청자 이름. 비어있지 않은 문자열. */
  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  name: string;

  /** 연락처. 숫자/공백/+,-,() 만 허용. */
  @IsString()
  @IsNotEmpty({ message: '연락처를 입력해주세요.' })
  @Matches(/^[0-9+\-()\s]+$/, { message: '연락처 형식이 올바르지 않습니다.' })
  phone: string;
}
