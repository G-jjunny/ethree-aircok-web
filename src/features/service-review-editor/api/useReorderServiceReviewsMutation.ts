'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import {
  serviceReviewKeys,
  revalidateServiceReviewCache,
} from '@/entities/service-review'
import type { ServiceReview } from '@/entities/service-review'

/**
 * 진단 후기 순서 변경 mutation.
 * 정렬된 전체 id 배열을 받아 PATCH /service-reviews/reorder로 전송한다.
 * body는 { items: [{ id, order }] } 형태(백엔드 ReorderServiceReviewsDto 확인) — 호출부는
 * id 배열만 넘기고 여기서 인덱스를 order로 매핑한다(order 중복/누락 방지).
 *
 * 백엔드가 빈 배열을 거부(ArrayNotEmpty → 400)하므로 빈 배열이면 요청하지 않는다.
 * 응답은 갱신된 **어드민 전체 배열**(미공개 포함)이다.
 *
 * 성공 시 목록 캐시(공개+어드민)와 서버 캐시(service-reviews 태그)를 무효화한다.
 */
export function useReorderServiceReviewsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (orderedIds: string[]) => {
      if (orderedIds.length === 0) return []
      const { data } = await axiosInstance.patch<ServiceReview[]>(
        '/service-reviews/reorder',
        { items: orderedIds.map((id, index) => ({ id, order: index })) },
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceReviewKeys.all })
      void revalidateServiceReviewCache()
    },
  })
}
