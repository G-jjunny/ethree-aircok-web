import { axiosInstance } from '@/shared/api'
import type { CatalogImage } from '@/entities/catalog'

/**
 * 카탈로그 이미지를 2단계로 업로드하고, 생성된 카탈로그 항목을 반환한다.
 *   ① POST /catalog/images (multipart, field명 `image`) → { url } 에서 url 추출
 *   ② POST /catalog (json) body { imageUrl } → 생성된 단건 CatalogImage 반환
 */
export async function uploadCatalogImage(file: File): Promise<CatalogImage> {
  const formData = new FormData()
  formData.append('image', file)
  const uploadRes = await axiosInstance.post<{ url: string }>(
    '/catalog/images',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  const { url } = uploadRes.data

  const createRes = await axiosInstance.post<CatalogImage>('/catalog', {
    imageUrl: url,
  })
  return createRes.data
}
