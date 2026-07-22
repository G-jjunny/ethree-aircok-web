import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { faqCategoryKeys } from '@/entities/faq'
import { revalidateFaqCache } from '@/entities/faq'

interface UpdateFaqCategoryPayload {
  name?: string
  order?: number
}

export function useUpdateFaqCategoryMutation(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateFaqCategoryPayload) =>
      axiosInstance.patch(`/faq/categories/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqCategoryKeys.all })
      void revalidateFaqCache()
    },
  })
}
