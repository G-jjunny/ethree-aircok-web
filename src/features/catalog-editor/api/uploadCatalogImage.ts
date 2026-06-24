// TODO(contract): backend-leader 카탈로그 업로드 계약 확정 후 동기화
//   - POST /catalog/images (multipart, field명 `image`)
//   - 응답: { data: CatalogImage } 가정. News(uploadImage)와 달리 url 문자열이 아닌
//     생성된 이미지 객체를 반환받는다(목록에 바로 반영하기 위함).
import { axiosInstance } from '@/shared/api'
import type { CatalogImage } from '@/entities/catalog'

/**
 * 카탈로그 이미지를 multipart로 업로드하고, 생성된 이미지 객체를 반환한다.
 * field명은 News uploadImage 패턴과 동일하게 `image`.
 */
export async function uploadCatalogImage(file: File): Promise<CatalogImage> {
  const formData = new FormData()
  formData.append('image', file)
  const res = await axiosInstance.post<{ data: CatalogImage }>(
    '/catalog/images',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return res.data.data
}
