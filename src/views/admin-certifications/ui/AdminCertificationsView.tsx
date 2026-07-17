'use client'

import { useQuery } from '@tanstack/react-query'
import { adminCertificationListQueryOptions } from '@/entities/certification'
import { AdminPageHeader } from '@/shared/ui'
import { CertificationUploadSection } from './CertificationUploadSection'
import { CertificationGridSection } from './CertificationGridSection'

/**
 * 특허·인증서 관리 어드민 뷰(섹션 조합 역할).
 *
 * 목록은 캐시버스터를 붙인 어드민 옵션으로 조회한다 — 공개 GET의 HTTP 캐시(max-age=60)로
 * 삭제/추가 직후 낡은 목록이 보이는 회귀를 우회한다(certificationApi.ts 주석 참조).
 */
export function AdminCertificationsView() {
  const { data: certifications = [], isLoading } = useQuery(
    adminCertificationListQueryOptions(),
  )

  return (
    <div>
      <AdminPageHeader
        title="특허·인증서 관리"
        description="특허증·성능인증서 이미지를 등록·삭제·정렬합니다."
      />
      <div className="p-6 lg:p-8 flex flex-col gap-8">
        <CertificationUploadSection />
        <CertificationGridSection
          certifications={certifications}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
