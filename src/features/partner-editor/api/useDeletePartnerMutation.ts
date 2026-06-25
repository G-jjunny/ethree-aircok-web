'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { partnerKeys } from '@/entities/partner'

export function useDeletePartnerMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/partners/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerKeys.all })
    },
  })
}
