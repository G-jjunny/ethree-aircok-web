'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { coreValueKeys } from '@/entities/core-value'
import type { CoreValue, CoreValueCreateBody } from '@/entities/core-value'

export function useCreateCoreValueMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: CoreValueCreateBody) => {
      const { data } = await axiosInstance.post<CoreValue>('/core-values', body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coreValueKeys.all })
    },
  })
}
