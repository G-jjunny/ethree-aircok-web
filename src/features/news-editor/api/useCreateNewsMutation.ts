import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { adminNewsKeys } from '@/entities/news'

interface NewsPayload {
  title: string
  description: string
  content: string
  date: string
  published: boolean
  location?: string
  coverImage?: string
}

export function useCreateNewsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: NewsPayload) =>
      axiosInstance.post('/news', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminNewsKeys.all })
    },
  })
}
