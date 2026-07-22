import type { AirDeviceFormValues } from '@/features/air-device-editor'

/** 단일 행 텍스트 입력으로 편집하는 필드 이름. */
export type AirDeviceTextFieldName = Extract<
  keyof AirDeviceFormValues,
  | 'name'
  | 'subtitle'
  | 'badge'
  | 'size'
  | 'weight'
  | 'power'
  | 'comm'
  | 'storage'
  | 'operatingTemp'
>

export interface AirDeviceFieldConfig {
  name: AirDeviceTextFieldName
  label: string
  placeholder: string
}

/**
 * 모델 식별 정보 필드(카드 상단에 노출되는 값).
 * 폼 입력과 카드 표시가 같은 라벨을 쓰도록 단일 출처로 둔다.
 */
export const AIR_DEVICE_IDENTITY_FIELDS: readonly AirDeviceFieldConfig[] = [
  { name: 'name', label: '모델명', placeholder: '예: SA-IL2 / SA-IEW' },
  { name: 'subtitle', label: '모델 부제', placeholder: '예: 조달청 혁신제품 선정 모델' },
  { name: 'badge', label: '뱃지 문구', placeholder: '예: 조달청 혁신제품' },
]

/** 제품 사양 필드. 카드의 사양 목록과 폼 입력이 이 순서를 공유한다. */
export const AIR_DEVICE_SPEC_FIELDS: readonly AirDeviceFieldConfig[] = [
  { name: 'size', label: '크기', placeholder: '예: 180 × 130 × 30 mm' },
  { name: 'weight', label: '무게', placeholder: '예: 270 g (LTE 포함 300 g)' },
  { name: 'power', label: '전원', placeholder: '예: 12V / 200mA' },
  { name: 'comm', label: '통신', placeholder: '예: LTE / Ethernet / Wi-Fi 중 선택' },
  { name: 'storage', label: '저장', placeholder: '예: micro SD · 최장 3년' },
  { name: 'operatingTemp', label: '동작 온도', placeholder: '예: -10℃ ~ 60℃' },
]
