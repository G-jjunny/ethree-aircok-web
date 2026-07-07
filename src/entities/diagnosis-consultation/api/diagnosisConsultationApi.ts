import { queryOptions } from '@tanstack/react-query'
import { axiosInstance, ApiError, authAwareRetry } from '@/shared/api'
import type {
  DiagnosisConsultation,
  DiagnosisConsultationListResponse,
  UpdateDiagnosisConsultationBody,
} from '../model/types'

export class DiagnosisConsultationApiError extends ApiError {}

export const diagnosisConsultationKeys = {
  all: ['admin-diagnosis-consultation'] as const,
  list: () => [...diagnosisConsultationKeys.all, 'list'] as const,
  count: () => [...diagnosisConsultationKeys.all, 'new-count'] as const,
  detail: (id: string) => [...diagnosisConsultationKeys.all, 'detail', id] as const,
}

export async function getAdminDiagnosisConsultationList(): Promise<DiagnosisConsultationListResponse> {
  const { data } = await axiosInstance.get('/diagnosis-consultation', {
    params: { page: 1, limit: 1000 },
  })
  // TRANSITIONAL(B2): backend will return an envelope; tolerate legacy bare array until B2 ships.
  if (Array.isArray(data)) {
    return { data, total: data.length, page: 1, limit: data.length }
  }
  return data as DiagnosisConsultationListResponse
}

export async function getDiagnosisConsultationDetail(
  id: string,
): Promise<DiagnosisConsultation> {
  const { data } = await axiosInstance.get<DiagnosisConsultation>(
    `/diagnosis-consultation/${id}`,
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

export function diagnosisConsultationDetailQueryOptions(id: string) {
  return queryOptions({
    queryKey: diagnosisConsultationKeys.detail(id),
    queryFn: () => getDiagnosisConsultationDetail(id),
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
