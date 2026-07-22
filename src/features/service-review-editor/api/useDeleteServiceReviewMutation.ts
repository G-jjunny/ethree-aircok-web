'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import {
  serviceReviewKeys,
  revalidateServiceReviewCache,
} from '@/entities/service-review'

/**
 * 진단 후기 삭제 mutation.
 * DELETE /service-reviews/:id → 204 No Content(본문 없음).
 * 성공 시 목록 캐시(공개+어드민)와 서버 캐시(service-reviews 태그)를 무효화한다.
 */
export function useDeleteServiceReviewMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/service-reviews/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceReviewKeys.all })
      void revalidateServiceReviewCache()
    },
  })
}
