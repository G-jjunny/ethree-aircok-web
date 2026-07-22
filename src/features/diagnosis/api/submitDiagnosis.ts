import { axiosInstance } from '@/shared/api'
import type { DiagnosisFormValues } from '../model/diagnosisSchema'

export async function submitDiagnosis(data: DiagnosisFormValues): Promise<void> {
  await axiosInstance.post('/diagnosis-consultation', data)
}
