'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { revalidateCoreValuesCache } from '@/entities/core-value'
import { coreValueKeys } from '@/entities/core-value'
import type { CoreValue } from '@/entities/core-value'

export function useReorderCoreValuesMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (items: Array<{ id: string; order: number }>) => {
      const { data } = await axiosInstance.patch<CoreValue[]>('/core-values/reorder', { items })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: coreValueKeys.all })
      void revalidateCoreValuesCache()
    },
  })
}
