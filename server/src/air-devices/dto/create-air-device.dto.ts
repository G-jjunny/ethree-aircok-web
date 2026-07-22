import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { AirDeviceItemDto } from './air-device-item.dto';

/**
 * POST /api/air-devices 요청 바디 (#services 1단계).
 *
 * Content-Type: application/json (파일 업로드 아님)
 * - name, subtitle, badge, size, weight, power, comm, storage, operatingTemp 는 필수.
 *   스펙 표의 행이 비지 않도록 생성 시 전부 강제한다.
 * - imageUrl 은 이 DTO 에 없다. 제품 사진은 레코드 생성 후
 *   POST /api/air-devices/:id/image (multipart, 필드명 file) 로 업로드한다(partners 로고 패턴).
 *   전역 ValidationPipe 가 forbidNonWhitelisted: true 이므로 imageUrl 을 실어 보내면 400 이다.
 * - order 는 미지정 시 service 기본 정책(맨 뒤 = 마지막 order + 1 자동 채번) 적용.
 * - published 는 미지정 시 Prisma 기본값 true(등록 즉시 노출).
 * - items 는 중첩 생성된다(Prisma nested create). 미지정 시 빈 목록으로 생성.
 */
export class CreateAirDeviceDto {
  /** 모델명(예: "SA-IL2 / SA-IEW"). */
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  /** 모델 부제(예: "조달청 혁신제품 선정 모델"). */
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  subtitle: string;

  /** 카드 뱃지 문구(예: "조달청 혁신제품"). */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  badge: string;

  /** 크기 표시 문자열(예: "180 × 130 × 30 mm"). */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  size: string;

  /** 무게 표시 문자열(예: "270 g (LTE 포함 300 g)"). */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  weight: string;

  /** 전원 표시 문자열(예: "12V / 200mA"). */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  power: string;

  /** 통신 방식 표시 문자열(예: "LTE / Ethernet / Wi-Fi 중 선택"). */
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  comm: string;

  /** 저장 방식 표시 문자열(예: "micro SD · 최장 3년"). */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  storage: string;

  /** 동작 온도 표시 문자열(예: "-10℃ ~ 60℃"). */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  operatingTemp: string;

  /** 표시 순서(오름차순). 미지정 시 맨 뒤(마지막 order + 1)에 자동 채번. */
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  /** 공개 여부. 미지정 시 true(등록 즉시 노출). */
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  /** 측정 항목 배열. 미지정 시 빈 목록으로 생성. 빈 배열 허용. */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AirDeviceItemDto)
  items?: AirDeviceItemDto[];
}
