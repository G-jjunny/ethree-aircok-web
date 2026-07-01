import { queryOptions } from '@tanstack/react-query'
import { axiosInstance, ApiError, authAwareRetry } from '@/shared/api'
import type {
  DiagnosisConsultation,
  UpdateDiagnosisConsultationBody,
} from '../model/types'

export class DiagnosisConsultationApiError extends ApiError {}

export const diagnosisConsultationKeys = {
  all: ['admin-diagnosis-consultation'] as const,
  list: () => [...diagnosisConsultationKeys.all, 'list'] as const,
  count: () => [...diagnosisConsultationKeys.all, 'new-count'] as const,
}

export async function getAdminDiagnosisConsultationList(): Promise<DiagnosisConsultation[]> {
  const { data } = await axiosInstance.get<DiagnosisConsultation[]>(
    '/diagnosis-consultation',
  )
  return data
}

export async function getNewDiagnosisConsultationCount(): Promise<number> {
  const { data } = await axiosInstance.get<{ count: number }>(
    '/diagnosis-consultation/new-count',
  )
  return data.count
}

export async function updateDiagnosisConsultation(
  id: string,
  body: UpdateDiagnosisConsultationBody,
): Promise<DiagnosisConsultation> {
  const { data } = await axiosInstance.patch<DiagnosisConsultation>(
    `/diagnosis-consultation/${id}`,
    body,
  )
  return data
}

export function adminDiagnosisConsultationQueryOptions() {
  return queryOptions({
    queryKey: diagnosisConsultationKeys.list(),
    queryFn: getAdminDiagnosisConsultationList,
    staleTime: 0,
    retry: authAwareRetry,
  })
}

export function newDiagnosisConsultationCountQueryOptions() {
  return queryOptions({
    queryKey: diagnosisConsultationKeys.count(),
    queryFn: getNewDiagnosisConsultationCount,
    staleTime: 0,
    retry: authAwareRetry,
  })
}
