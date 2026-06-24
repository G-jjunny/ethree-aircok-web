import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { faqItemKeys } from '@/entities/faq'

interface CreateFaqItemPayload {
  categoryId: string
  question: string
  answer: string
  order?: number
}

export function useCreateFaqItemMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateFaqItemPayload) =>
      axiosInstance.post('/faq/items', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqItemKeys.all })
    },
  })
}
