import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * PUT /api/site-info 요청 바디 (#48).
 *
 * PUT 시맨틱: companyName, address, phone, email, bizNo, ceo 는 필수(NOT NULL DB 컬럼과 일치).
 * 선택 필드(legalName, fax, mailOrderNo, SNS)는 미전달 시 null 저장.
 *
 * service 는 이 DTO 로 upsert({ where: { id: 'singleton' }, create: ..., update: ... }) 호출.
 */
export class UpsertSiteInfoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  companyName: string;

  /** 법인명. 미전달 시 null 저장. */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  legalName?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(300)
  address: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(30)
  phone: string;

  @IsEmail()
  @MaxLength(200)
  email: string;

  /** 사업자등록번호. 형식 검증은 service 에서 별도 처리 가능. */
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  bizNo: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  ceo: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  fax?: string;

  /** 통신판매업 신고번호. */
  @IsOptional()
  @IsString()
  @MaxLength(100)
  mailOrderNo?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  instagram?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  youtube?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  linkedin?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  facebook?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  kakaoUrl?: string;
}
