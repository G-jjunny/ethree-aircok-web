import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { faqCategoryKeys } from '@/entities/faq'

export function useDeleteFaqCategoryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.delete(`/faq/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqCategoryKeys.all })
    },
  })
}
