'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { teamImageKeys } from '@/entities/team-image'
import { revalidateTeamImagesCache } from '@/entities/team-image'
import type { TeamImage, TeamImageUpdateBody } from '@/entities/team-image'

/**
 * 팀 이미지 수정 mutation.
 * PATCH /team-images/:id — 없으면 404.
 */
export function useUpdateTeamImageMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: TeamImageUpdateBody }) => {
      const { data } = await axiosInstance.patch<TeamImage>(`/team-images/${id}`, body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamImageKeys.all })
      void revalidateTeamImagesCache()
    },
  })
}
