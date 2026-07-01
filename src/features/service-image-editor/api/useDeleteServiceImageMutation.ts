import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { serviceImageKeys } from '@/entities/service-image'

/**
 * 제품군 이미지 삭제 mutation.
 * DELETE /service-images/:id → 204 No Content(바디 없음).
 * 성공 시 제품군 이미지 목록 캐시를 무효화한다.
 */
export function useDeleteServiceImageMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/service-images/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceImageKeys.all })
    },
  })
}
