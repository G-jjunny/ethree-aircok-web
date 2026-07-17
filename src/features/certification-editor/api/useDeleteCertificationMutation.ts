'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import {
  certificationKeys,
  revalidateCertificationCache,
} from '@/entities/certification'

/**
 * 인증서·특허증 삭제 mutation.
 * DELETE /certifications/:id → 204 No Content(본문 없음).
 * 성공 시 목록 캐시(공개+어드민)와 서버 캐시(certifications 태그)를 무효화한다.
 */
export function useDeleteCertificationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/certifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: certificationKeys.all })
      void revalidateCertificationCache()
    },
  })
}
