// TODO(contract): 카탈로그 순서 변경 계약 미확정.
//   잠정: PATCH /catalog/images/reorder, body { orderedIds: string[] }
//   (정렬된 id 배열 전체를 보내고 백엔드가 order를 인덱스로 재할당하는 방식 가정)
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import { catalogKeys } from '@/entities/catalog'

/**
 * 카탈로그 이미지 순서 변경 mutation.
 * 정렬된 전체 id 배열을 전송한다(드래그앤드롭 결과).
 * 성공 시 어드민 목록 캐시를 무효화한다.
 */
export function useReorderCatalogImagesMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (orderedIds: string[]) =>
      axiosInstance.patch('/catalog/images/reorder', { orderedIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: catalogKeys.adminAll })
    },
  })
}
