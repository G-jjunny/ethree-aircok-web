'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { teamImageKeys } from '@/entities/team-image'
import type { TeamImage } from '@/entities/team-image'

/**
 * 팀 이미지 순서 변경 mutation.
 * PATCH /team-images/reorder — body { items: [{ id, order }] } → TeamImage[] 반환.
 */
export function useReorderTeamImagesMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (items: Array<{ id: string; order: number }>) => {
      const { data } = await axiosInstance.patch<TeamImage[]>('/team-images/reorder', { items })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamImageKeys.all })
    },
  })
}
