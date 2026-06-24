// TODO(contract): PATCH /catalog/images/:id (multipart 교체, field명 `image`)
//   응답 { data: CatalogImage } 가정. PUT일 수도 있음 — 계약 확정 후 메서드 동기화.
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { catalogKeys } from '@/entities/catalog'
import type { CatalogImage } from '@/entities/catalog'

/**
 * 기존 카탈로그 이미지의 파일을 교체하는 mutation.
 * 같은 id를 유지한 채 이미지 파일만 multipart로 교체한다.
 * 성공 시 어드민 목록 캐시를 무효화한다.
 */
export function useReplaceCatalogImageMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData()
      formData.append('image', file)
      const res = await axiosInstance.patch<{ data: CatalogImage }>(
        `/catalog/images/${id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.adminAll })
    },
  })
}
