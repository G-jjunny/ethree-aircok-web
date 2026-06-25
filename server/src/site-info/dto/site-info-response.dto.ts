/**
 * SiteInfo 응답 DTO (#48).
 *
 * GET /api/site-info 및 PUT /api/site-info 공통 응답 타입.
 * id 는 항상 'singleton' 이지만 프론트엔드 타입 호환을 위해 포함한다.
 */
export class SiteInfoResponseDto {
  /** 항상 'singleton'. */
  id: string;
  companyName: string;
  /** 법인명(상호명과 다를 경우). nullable. */
  legalName: string | null;
  address: string;
  phone: string;
  email: string;
  bizNo: string;
  ceo: string;
  fax: string | null;
  mailOrderNo: string | null;
  instagram: string | null;
  youtube: string | null;
  linkedin: string | null;
  facebook: string | null;
  kakaoUrl: string | null;
  /** ISO 8601 문자열. */
  updatedAt: string;
}
