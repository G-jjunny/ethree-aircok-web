import { axiosInstance } from '@/shared/api'
import type { TeamImage } from '@/entities/team-image'

/**
 * 팀 이미지를 2단계로 업로드하고, 생성된 팀 이미지 항목을 반환한다.
 *   ① POST /team-images/uploads (multipart, field명 `file`) → { url } (catalog와 달리 fileType 없음)
 *   ② POST /team-images (json) body { imageUrl } → 생성된 단건 TeamImage 반환
 *
 * order는 전송하지 않는다 — 서버가 자동으로 append 한다.
 * 이미 3개면 ②에서 400 BadRequest가 발생하며, 메시지는 error.response.data.message(문자열)에 담긴다.
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
