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

export function useUpdateNewsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & NewsPayload) =>
      axiosInstance.patch(`/news/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminNewsKeys.all })
    },
  })
}
