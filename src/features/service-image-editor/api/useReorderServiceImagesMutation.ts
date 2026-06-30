import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { serviceImageKeys } from '@/entities/service-image'

/**
 * 제품군 이미지 순서 변경 mutation.
 * 정렬된 전체 id 배열을 받아 PATCH /service-images/reorder로 전송한다.
 * body는 { items: [{ id, order }] } 형태 — 호출부는 id 배열만 넘기고
 * 여기서 인덱스를 order로 매핑한다.
 * 성공 시 제품군 이미지 목록 캐시를 무효화한다.
 */
export function useReorderServiceImagesMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (orderedIds: string[]) =>
      axiosInstance.patch('/service-images/reorder', {
        items: orderedIds.map((id, index) => ({ id, order: index })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceImageKeys.all })
    },
  })
}
