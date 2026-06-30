import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { diagnosisImageKeys } from '@/entities/diagnosis-image'

/**
 * 진단 이미지 삭제 mutation.
 * DELETE /diagnosis-images/:id → 204 No Content(바디 없음).
 * 성공 시 진단 이미지 목록 캐시를 무효화한다.
 */
export function useDeleteDiagnosisImageMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => axiosInstance.delete(`/diagnosis-images/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: diagnosisImageKeys.all })
    },
  })
}
