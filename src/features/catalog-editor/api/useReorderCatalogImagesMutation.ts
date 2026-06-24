import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { catalogKeys } from '@/entities/catalog'

/**
 * 카탈로그 이미지 순서 변경 mutation.
 * 정렬된 전체 id 배열을 받아 PATCH /catalog/reorder로 전송한다.
 * body는 { items: [{ id, order }] } 형태(전체 배열, 빈 배열 불가).
 * 호출부(CatalogImageGridSection)는 id 배열만 넘기므로 여기서 인덱스를 order로 매핑한다.
 * 성공 시 카탈로그 목록 캐시를 무효화한다.
 */
export function useReorderCatalogImagesMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (orderedIds: string[]) =>
      axiosInstance.patch('/catalog/reorder', {
        items: orderedIds.map((id, index) => ({ id, order: index })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.all })
    },
  })
}
