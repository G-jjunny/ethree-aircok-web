'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { revalidateTimelineCache } from '@/entities/timeline'
import { timelineKeys } from '@/entities/timeline'
import type { TimelineItem, TimelineUpdateBody } from '@/entities/timeline'

export function useUpdateTimelineMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: TimelineUpdateBody }) => {
      const { data } = await axiosInstance.patch<TimelineItem>(`/timelines/${id}`, body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timelineKeys.all })
      void revalidateTimelineCache()
    },
  })
}
