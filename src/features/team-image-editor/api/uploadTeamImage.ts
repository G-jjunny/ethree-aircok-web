import { axiosInstance } from '@/shared/api'
import type { TeamImage } from '@/entities/team-image'

/**
 * 팀 이미지를 2단계로 업로드하고, 생성된 팀 이미지 항목을 반환한다.
 *   ① POST /team-images/uploads (multipart, field명 `file`) → { url } (catalog와 달리 fileType 없음)
 *   ② POST /team-images (json) body { imageUrl } → 생성된 단건 TeamImage 반환
 *
 * order는 전송하지 않는다 — 서버가 자동으로 처리한다.
 * 이미지가 이미 존재하면 기존 레코드가 새 URL로 교체된다(replace).
 */
export async function uploadTeamImage(file: File): Promise<TeamImage> {
  const formData = new FormData()
  formData.append('file', file)
  const uploadRes = await axiosInstance.post<{ url: string }>(
    '/team-images/uploads',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )
  const { url } = uploadRes.data

  const createRes = await axiosInstance.post<TeamImage>('/team-images', {
    imageUrl: url,
  })
  return createRes.data
}
