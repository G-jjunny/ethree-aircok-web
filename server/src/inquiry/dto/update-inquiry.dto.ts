import { IsIn, IsString } from 'class-validator';

/**
 * 문의하기(Inquiry) 상태 변경 요청 바디 (어드민 전용, JwtAuthGuard).
 *
 * Content-Type: application/json
 * - PATCH /api/inquiry/:id 의 요청 바디.
 * - 이 PATCH 는 status 변경 전용이므로 status 는 필수(optional 아님).
 * - 허용값: "NEW" | "IN_PROGRESS" | "DONE" (그 외 값은 400).
 */
export class UpdateInquiryDto {
  /** 처리 상태. 허용값: "NEW" | "IN_PROGRESS" | "DONE". */
  @IsString()
  @IsIn(['NEW', 'IN_PROGRESS', 'DONE'])
  status: string;
}
