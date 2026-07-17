'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import {
  serviceReviewKeys,
  revalidateServiceReviewCache,
} from '@/entities/service-review'
import type { ServiceReview } from '@/entities/service-review'
import type { ServiceReviewFormValues } from '../model/serviceReviewSchema'

/**
 * 진단 후기 부분 수정 mutation.
 * PATCH /service-reviews/:id (application/json) → 갱신된 단건을 반환한다.
 *
 * body에 `imageUrl`·`id`를 넣지 않는다(forbidNonWhitelisted → 400). 아바타 교체는 이미지 업로드 훅을 쓴다.
 * quote/role/age/published만 전송한다.
 *
 * 성공 시 목록 캐시(공개+어드민)와 서버 캐시(service-reviews 태그)를 무효화한다.
 */
export function useUpdateServiceReviewMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string
      body: ServiceReviewFormValues
    }) => {
      const { data } = await axiosInstance.patch<ServiceReview>(
        `/service-reviews/${id}`,
        body,
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceReviewKeys.all })
      void revalidateServiceReviewCache()
    },
  })
}
