'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { timelineKeys } from '@/entities/timeline'
import type { TimelineItem, TimelineCreateBody } from '@/entities/timeline'

export function useCreateTimelineMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: TimelineCreateBody) => {
      const { data } = await axiosInstance.post<TimelineItem>('/timelines', body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timelineKeys.all })
    },
  })
}
