'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { teamImageKeys } from '@/entities/team-image'
import type { TeamImage, TeamImageCreateBody } from '@/entities/team-image'

/**
 * 팀 이미지 생성 mutation.
 * order 생략 시 서버가 자동 append 한다.
 */
export function useCreateTeamImageMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: TeamImageCreateBody) => {
      const { data } = await axiosInstance.post<TeamImage>('/team-images', body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamImageKeys.all })
    },
  })
}
