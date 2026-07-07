'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { revalidatePartnersCache } from '@/entities/partner'
import { partnerKeys } from '@/entities/partner'
import type { Partner, PartnerUpdateBody } from '@/entities/partner'

export function useUpdatePartnerMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: PartnerUpdateBody }) => {
      const { data } = await axiosInstance.patch<Partner>(`/partners/${id}`, body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerKeys.all })
      void revalidatePartnersCache()
    },
  })
}
