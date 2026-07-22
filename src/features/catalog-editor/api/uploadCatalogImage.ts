import { axiosInstance } from '@/shared/api'
import type { CatalogImage } from '@/entities/catalog'

/**
 * 카탈로그 파일(이미지 또는 PDF)을 2단계로 업로드하고, 생성된 카탈로그 항목을 반환한다.
 *   ① POST /catalog/uploads (multipart, field명 `file`) → { url, fileType }
 *   ② POST /catalog (json) body { fileUrl, fileType } → 생성된 단건 CatalogImage 반환
 *
 * 서버 ValidationPipe(forbidNonWhitelisted)에 걸리지 않도록 fileUrl/fileType만 전송한다.
 */
export async function uploadCatalogImage(file: File): Promise<CatalogImage> {
  const formData = new FormData()
  formData.append('file', file)
  const uploadRes = await axiosInstance.post<{
    url: string
    fileType: 'image' | 'pdf'
  }>('/catalog/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  const { url, fileType } = uploadRes.data

  const createRes = await axiosInstance.post<CatalogImage>('/catalog', {
    fileUrl: url,
    fileType,
  })
  return createRes.data
}
