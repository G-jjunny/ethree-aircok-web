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
 * 진단 후기 생성 mutation.
 * POST /service-reviews (application/json) → 생성된 단건(201)을 반환한다.
 *
 * body에 `imageUrl`·`id`를 넣지 않는다 — 백엔드 ValidationPipe가 forbidNonWhitelisted이므로 400이다.
 * 아바타는 생성 후 useUploadServiceReviewImageMutation(multipart)으로 별도 업로드한다.
 *
 * 성공 시 목록 캐시(공개+어드민)와 서버 캐시(service-reviews 태그)를 무효화한다.
 */
export function useCreateServiceReviewMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: ServiceReviewFormValues) => {
      const { data } = await axiosInstance.post<ServiceReview>(
        '/service-reviews',
        body,
      )
      return data
    },
    onSuccess: () => {
      // serviceReviewKeys.admin은 all을 prefix로 가지므로 all 무효화로 어드민 캐시까지 갱신된다.
      queryClient.invalidateQueries({ queryKey: serviceReviewKeys.all })
      void revalidateServiceReviewCache()
    },
  })
}
