import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { catalogKeys } from '@/entities/catalog'
import type { CatalogImage } from '@/entities/catalog'

/**
 * 기존 카탈로그 항목의 파일(이미지 또는 PDF)을 교체하는 mutation(2단계).
 *   ① POST /catalog/uploads (multipart, field명 `file`) → { url, fileType }
 *   ② PATCH /catalog/:id (json) body { fileUrl, fileType } → 갱신 단건 CatalogImage
 * 성공 시 카탈로그 목록 캐시를 무효화한다.
 */
export function useReplaceCatalogImageMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await axiosInstance.post<{
        url: string
        fileType: 'image' | 'pdf'
      }>('/catalog/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const { url, fileType } = uploadRes.data

      const patchRes = await axiosInstance.patch<CatalogImage>(
        `/catalog/${id}`,
        { fileUrl: url, fileType },
      )
      return patchRes.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.all })
    },
  })
}
