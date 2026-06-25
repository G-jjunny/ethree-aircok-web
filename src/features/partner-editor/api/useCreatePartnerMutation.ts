'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { partnerKeys } from '@/entities/partner'
import type { Partner, PartnerCreateBody } from '@/entities/partner'

export function useCreatePartnerMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: PartnerCreateBody) => {
      const { data } = await axiosInstance.post<Partner>('/partners', body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerKeys.all })
    },
  })
}
