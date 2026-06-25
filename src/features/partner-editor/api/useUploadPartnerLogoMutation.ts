'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { partnerKeys } from '@/entities/partner'

export function useUploadPartnerLogoMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await axiosInstance.post<{ url: string }>(`/partners/${id}/logo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerKeys.all })
    },
  })
}
