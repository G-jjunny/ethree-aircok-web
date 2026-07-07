import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { adminNewsKeys, revalidateNewsCache } from '@/entities/news'

export function useDeleteNewsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/news/${id}`),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: adminNewsKeys.all })
      // 목록 + 해당 상세(news-${id}) 캐시를 함께 무효화한다.
      void revalidateNewsCache(id)
    },
  })
}
