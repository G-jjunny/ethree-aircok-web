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

export interface UpdateDiagnosisConsultationBody {
  status?: DiagnosisConsultationStatus
  consultationDate?: string
  consultant?: string
  notes?: string
}
