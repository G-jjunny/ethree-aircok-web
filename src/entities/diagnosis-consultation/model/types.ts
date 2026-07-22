export type DiagnosisConsultationStatus = 'NEW' | 'IN_PROGRESS' | 'DONE'

export interface DiagnosisConsultation {
  id: string
  name: string
  phone: string
  status: DiagnosisConsultationStatus
  consultationDate: string | null
  consultant: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

/**
 * 목록 조회 응답 아이템.
 * 백엔드(B2)의 `GET /api/diagnosis-consultation` select는 consultant/notes를 제외한다.
 * 상세 조회(`GET /api/diagnosis-consultation/:id`)로만 두 필드를 얻을 수 있으며,
 * 이 타입으로 컴파일러가 목록 아이템에서의 consultant/notes 접근을 차단해
 * prefill을 상세 조회로만 하도록 강제한다.
 */
export type DiagnosisConsultationListItem = Omit<
  DiagnosisConsultation,
  'consultant' | 'notes'
>

export interface UpdateDiagnosisConsultationBody {
  status?: DiagnosisConsultationStatus
  consultationDate?: string
  consultant?: string
  notes?: string
}

export interface DiagnosisConsultationListResponse {
  data: DiagnosisConsultationListItem[]
  total: number
  page: number
  limit: number
}
