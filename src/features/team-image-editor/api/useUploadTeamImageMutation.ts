'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { teamImageKeys } from '@/entities/team-image'
import { revalidateTeamImagesCache } from '@/entities/team-image'
import { uploadTeamImage } from './uploadTeamImage'

/**
 * 팀 이미지 업로드 mutation(2단계: 업로드 → 생성).
 * 성공 시 팀 이미지 목록 캐시를 무효화한다.
 */
export function useUploadTeamImageMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => uploadTeamImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamImageKeys.all })
      void revalidateTeamImagesCache()
    },
  })
}
