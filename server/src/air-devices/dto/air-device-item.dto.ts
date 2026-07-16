import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

/**
 * 측정기 측정 항목(AirDeviceItem) 중첩 DTO (#services 1단계).
 *
 * POST /api/air-devices, PATCH /api/air-devices/:id 의 items 배열 요소로 사용된다.
 * 독립 엔드포인트는 없다 — 항상 부모 AirDevice 요청에 중첩된다.
 *
 * 주의: 요청 DTO 에 id 필드는 두지 않는다.
 * items 는 replace-all(전체 교체) 시맨틱이라 서버가 기존 항목을 전부 삭제 후 재생성하므로
 * 클라이언트가 보낸 id 는 의미가 없다. 전역 ValidationPipe 가 forbidNonWhitelisted: true 이므로
 * id 를 실어 보내면 400 이 발생한다(응답 DTO 에는 서버가 발급한 id 가 포함된다).
 */
export class AirDeviceItemDto {
  /** 측정 항목 코드(예: "PM2.5", "CO₂"). */
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  /** 측정 항목 한글명(예: "초미세먼지"). */
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  label: string;

  /**
   * 부모 내 표시 순서(오름차순).
   * 미지정 시 service 가 배열 인덱스를 order 로 채번한다(전달 순서 = 표시 순서).
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
