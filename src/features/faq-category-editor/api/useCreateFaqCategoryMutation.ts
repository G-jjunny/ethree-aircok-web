import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { faqCategoryKeys } from '@/entities/faq'

interface CreateFaqCategoryPayload {
  name: string
  order?: number
}

export function useCreateFaqCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateFaqCategoryPayload) =>
      axiosInstance.post('/faq/categories', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqCategoryKeys.all })
    },
  })
}
