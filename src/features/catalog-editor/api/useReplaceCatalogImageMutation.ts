import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { catalogKeys } from '@/entities/catalog'
import type { CatalogImage } from '@/entities/catalog'

/**
 * 기존 카탈로그 이미지의 파일을 교체하는 mutation(2단계).
 *   ① POST /catalog/images (multipart, field명 `image`) → { url }
 *   ② PATCH /catalog/:id (json) body { imageUrl } → 갱신 단건 CatalogImage
 * 성공 시 카탈로그 목록 캐시를 무효화한다.
 */
export function useReplaceCatalogImageMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData()
      formData.append('image', file)
      const uploadRes = await axiosInstance.post<{ url: string }>(
        '/catalog/images',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      const { url } = uploadRes.data

      const patchRes = await axiosInstance.patch<CatalogImage>(
        `/catalog/${id}`,
        { imageUrl: url },
      )
      return patchRes.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.all })
    },
  })
}
