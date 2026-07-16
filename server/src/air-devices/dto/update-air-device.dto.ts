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
 * PATCH /api/air-devices/:id 요청 바디 (#services 1단계).
 *
 * 부분 수정 DTO — 전달된 필드만 갱신한다. 모든 필드 optional.
 * Content-Type: application/json (파일 업로드 아님)
 *
 * items replace-all(전체 교체) 시맨틱 — 구현자 주의:
 * - items 미전달(undefined): 기존 항목을 **그대로 유지**한다(건드리지 않음).
 * - items 전달(배열): 해당 deviceId 의 기존 항목을 deleteMany 로 **전부 삭제** 후 전달 배열을 재생성한다.
 *   deleteMany + create 는 반드시 단일 $transaction 으로 묶어 중간 실패 시 항목이 사라진 채로
 *   남지 않게 한다.
 * - items: [] 전달: 빈 배열은 "모두 지움"의 명시적 의사표시 → 전부 삭제하고 재생성하지 않는다.
 * - replace-all 이므로 자식 id 는 수정 때마다 재발급된다. 프론트는 item.id 를 영속 키로 신뢰하면 안 된다.
 *
 * imageUrl 은 이 DTO 에 없다. 제품 사진 교체는 POST /api/air-devices/:id/image
 * (multipart, 필드명 file)를 사용한다. 전역 ValidationPipe 가 forbidNonWhitelisted: true 이므로
 * imageUrl 을 실어 보내면 400 이다.
 *
 * order 단일 변경도 가능하나, 드래그앤드롭 일괄 순서변경은 PATCH /api/air-devices/reorder 를 사용한다.
 */
export class UpdateAirDeviceDto {
  /** 변경할 모델명. 미지정 시 기존 값 유지. */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name?: string;

  /** 변경할 모델 부제. 미지정 시 기존 값 유지. */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  subtitle?: string;

  /** 변경할 뱃지 문구. 미지정 시 기존 값 유지. */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  badge?: string;

  /** 변경할 크기 표시 문자열. 미지정 시 기존 값 유지. */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  size?: string;

  /** 변경할 무게 표시 문자열. 미지정 시 기존 값 유지. */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  weight?: string;

  /** 변경할 전원 표시 문자열. 미지정 시 기존 값 유지. */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  power?: string;

  /** 변경할 통신 방식 표시 문자열. 미지정 시 기존 값 유지. */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  comm?: string;

  /** 변경할 저장 방식 표시 문자열. 미지정 시 기존 값 유지. */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  storage?: string;

  /** 변경할 동작 온도 표시 문자열. 미지정 시 기존 값 유지. */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  operatingTemp?: string;

  /** 변경할 표시 순서(오름차순). 미지정 시 기존 값 유지. */
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  /** 변경할 공개 여부. 미지정 시 기존 값 유지. */
  @IsOptional()
  @IsBoolean()
  published?: boolean;

  /**
   * 교체할 측정 항목 배열(replace-all).
   * 미전달 시 기존 항목 유지, [] 전달 시 전부 삭제. 상세는 클래스 주석 참고.
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AirDeviceItemDto)
  items?: AirDeviceItemDto[];
}
