'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { axiosInstance } from '@/shared/api'
import {
  certificationKeys,
  revalidateCertificationCache,
} from '@/entities/certification'
import type { Certification } from '@/entities/certification'

/**
 * 인증서·특허증 업로드 mutation(단일 multipart POST = 레코드 생성).
 * POST /certifications (multipart/form-data, 필드명 `file` — 백엔드 FileInterceptor 확인)
 *   → 백엔드가 R2 업로드 + 레코드 생성을 한 번에 처리하고 생성된 단건(201)을 반환한다.
 *
 * 인증서는 이미지 교체 엔드포인트가 없다(수정 대신 삭제 후 재업로드).
 *
 * 백엔드 제약: MIME은 image/png|jpeg|webp|gif만 허용, 최대 5MB. 위반 시 400을 반환하므로
 * 호출부는 catch에서 `extractUploadError(error, fallback)`로 서버 메시지를 노출한다
 * (훅은 에러를 삼키지 않고 그대로 throw한다).
 *
 * 성공 시 목록 캐시(공개+어드민)와 서버 캐시(certifications 태그)를 무효화한다.
 */
export function useUploadCertificationMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await axiosInstance.post<Certification>(
        '/certifications',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      return data
    },
    onSuccess: () => {
      // certificationKeys.admin은 all을 prefix로 가지므로 all 무효화로 어드민 캐시까지 갱신된다.
      queryClient.invalidateQueries({ queryKey: certificationKeys.all })
      void revalidateCertificationCache()
    },
  })
}
