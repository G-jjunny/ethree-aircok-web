'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { revalidatePartnersCache } from '@/entities/partner'
import { partnerKeys } from '@/entities/partner'
import type { Partner } from '@/entities/partner'

export function useReorderPartnersMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (items: Array<{ id: string; order: number }>) => {
      const { data } = await axiosInstance.patch<Partner[]>('/partners/reorder', { items })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerKeys.all })
      void revalidatePartnersCache()
    },
  })
}
