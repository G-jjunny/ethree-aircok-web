import { IsNotEmpty, IsObject } from 'class-validator';

/**
 * 문의하기(Inquiry) 생성 요청 바디 (공개 엔드포인트).
 *
 * Content-Type: application/json
 * - POST /api/inquiry (인증 불필요) 의 요청 바디.
 * - 동적 폼 빌더(#33) 도입으로, 고정 필드 대신 동적 answers 객체를 받는다.
 *   answers 는 InquiryField.key → 사용자가 입력한 문자열 값 매핑이다.
 *   예: { "company": "에어콕", "name": "홍길동", "phone": "...", "email": "...", "message": "..." }
 *
 * 검증 책임 분리:
 * - DTO(여기): answers 가 객체이고 비어있지 않은지만 검증한다. 동적 키는 nested class
 *   로 검증할 수 없으므로 @IsObject() 로 통째로 받는다.
 * - Service: InquiryField 정의를 로드하여 (1) required 누락, (2) email/tel 형식,
 *   (3) 정의에 없는 key 처리, (4) 값 문자열 강제 등 동적 검증을 수행한다.
 *
 * 주의: ValidationPipe whitelist + forbidNonWhitelisted 정책상, answers 외의
 * 최상위 키(status/id 등)를 보내면 400 으로 거부된다. answers 내부 키는
 * 중첩 객체이므로 whitelist 검사 대상이 아니다(서비스가 정의 기반으로 거른다).
 */
export class CreateInquiryDto {
  /** 필드 key → 문자열 값 매핑. 빈 객체 불가. 내부 키 검증은 서비스가 동적으로 수행. */
  @IsObject()
  @IsNotEmpty()
  answers: Record<string, string>;
}
