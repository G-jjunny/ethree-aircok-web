'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { teamImageKeys } from '@/entities/team-image'
import { revalidateTeamImagesCache } from '@/entities/team-image'

/**
 * 팀 이미지 삭제 mutation.
 * DELETE /team-images/:id — 204.
 */
export function useDeleteTeamImageMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/team-images/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamImageKeys.all })
      void revalidateTeamImagesCache()
    },
  })
}
