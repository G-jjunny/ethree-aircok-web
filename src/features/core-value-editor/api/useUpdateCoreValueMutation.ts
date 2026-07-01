'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { coreValueKeys } from '@/entities/core-value'
import type { CoreValue, CoreValueUpdateBody } from '@/entities/core-value'

export function useUpdateCoreValueMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: CoreValueUpdateBody }) => {
      const { data } = await axiosInstance.patch<CoreValue>(`/core-values/${id}`, body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coreValueKeys.all })
    },
  })
}
