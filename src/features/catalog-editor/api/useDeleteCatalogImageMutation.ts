import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { catalogKeys } from '@/entities/catalog'

/**
 * 카탈로그 이미지 삭제 mutation.
 * DELETE /catalog/:id → 204 No Content(바디 없음).
 * 성공 시 카탈로그 목록 캐시를 무효화한다.
 */
export function useDeleteCatalogImageMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/catalog/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.all })
    },
  })
}
