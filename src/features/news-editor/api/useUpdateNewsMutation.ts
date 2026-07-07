import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { adminNewsKeys, revalidateNewsCache } from '@/entities/news'

interface NewsPayload {
  title: string
  description: string
  content?: string | null
  date: string
  published: boolean
  location?: string
  coverImage?: string
  type?: 'BLOG' | 'LINK'
  externalUrl?: string | null
}

export function useUpdateNewsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & NewsPayload) =>
      axiosInstance.patch(`/news/${id}`, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminNewsKeys.all })
      // 목록 + 해당 상세(news-${id}) 캐시를 함께 무효화한다.
      void revalidateNewsCache(variables.id)
    },
  })
}
