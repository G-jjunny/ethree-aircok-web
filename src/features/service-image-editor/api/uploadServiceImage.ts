import { axiosInstance } from '@/shared/api'
import type { ServiceImage } from '@/entities/service-image'

/**
 * 제품군 이미지를 단일 multipart 요청으로 업로드하고, 생성된 항목을 반환한다.
 *   POST /service-images (multipart/form-data, 필드명 `file`)
 *     → 백엔드가 R2 업로드 + 레코드 생성을 한 번에 처리하고 생성된 단건을 반환.
 *
 * 별도 /uploads 엔드포인트나 JSON body(imageUrl/alt)는 사용하지 않는다.
 */
export async function uploadServiceImage(file: File): Promise<ServiceImage> {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await axiosInstance.post<ServiceImage>(
    '/service-images',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data
}
