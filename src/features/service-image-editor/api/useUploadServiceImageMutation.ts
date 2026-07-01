import { useMutation, useQueryClient } from '@tanstack/react-query'
import { serviceImageKeys } from '@/entities/service-image'
import { uploadServiceImage } from './uploadServiceImage'

/**
 * 제품군 이미지 업로드 mutation(단일 multipart POST).
 * 성공 시 제품군 이미지 목록 캐시를 무효화한다.
 */
export function useUploadServiceImageMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => uploadServiceImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceImageKeys.all })
    },
  })
}
