import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { faqItemKeys } from '@/entities/faq'
import { revalidateFaqCache } from '@/entities/faq'

interface UpdateFaqItemPayload {
  categoryId?: string
  question?: string
  answer?: string
  order?: number
}

export function useUpdateFaqItemMutation(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateFaqItemPayload) =>
      axiosInstance.patch(`/faq/items/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqItemKeys.all })
      void revalidateFaqCache()
    },
  })
}
