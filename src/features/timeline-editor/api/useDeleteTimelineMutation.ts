'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { revalidateTimelineCache } from '@/entities/timeline'
import { timelineKeys } from '@/entities/timeline'

export function useDeleteTimelineMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/timelines/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timelineKeys.all })
      void revalidateTimelineCache()
    },
  })
}
