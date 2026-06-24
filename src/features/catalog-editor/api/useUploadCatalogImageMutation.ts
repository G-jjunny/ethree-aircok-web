// TODO(contract): POST /catalog/images (multipart) — 응답 { data: CatalogImage } 가정
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { catalogKeys } from '@/entities/catalog'
import { uploadCatalogImage } from './uploadCatalogImage'

/**
 * 카탈로그 이미지 업로드 mutation.
 * 성공 시 어드민 목록 캐시를 무효화한다.
 */
export function useUploadCatalogImageMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => uploadCatalogImage(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.adminAll })
    },
  })
}
