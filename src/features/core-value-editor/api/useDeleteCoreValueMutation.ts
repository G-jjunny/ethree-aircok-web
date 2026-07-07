'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { revalidateCoreValuesCache } from '@/entities/core-value'
import { coreValueKeys } from '@/entities/core-value'

export function useDeleteCoreValueMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/core-values/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coreValueKeys.all })
      void revalidateCoreValuesCache()
    },
  })
}
