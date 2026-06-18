import type { DiagnosisFormValues } from '../model/diagnosisSchema'

// TODO: 실제 엔드포인트 연동 필요 — backend-leader와 API 계약 확인 후 구현
export async function submitDiagnosis(data: DiagnosisFormValues): Promise<void> {
  // TODO: POST /api/diagnosis (엔드포인트 미확정 — backend-leader와 API 계약 확정 후 실제 fetch 구현 필요)
  // 임시 딜레이로 API 호출 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 800))
}
