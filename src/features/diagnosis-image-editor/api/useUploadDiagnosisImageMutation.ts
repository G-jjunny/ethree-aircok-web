import { useMutation, useQueryClient } from '@tanstack/react-query'
import { diagnosisImageKeys } from '@/entities/diagnosis-image'
import { uploadDiagnosisImage } from './uploadDiagnosisImage'

/**
 * 진단 이미지 업로드 mutation(단일 multipart POST).
 * 성공 시 진단 이미지 목록 캐시를 무효화한다.
 */
export function useUploadDiagnosisImageMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => uploadDiagnosisImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: diagnosisImageKeys.all })
    },
  })
}
