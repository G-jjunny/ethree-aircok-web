import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { faqItemKeys } from '@/entities/faq'

export function useDeleteFaqItemMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.delete(`/faq/items/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqItemKeys.all })
    },
  })
}
