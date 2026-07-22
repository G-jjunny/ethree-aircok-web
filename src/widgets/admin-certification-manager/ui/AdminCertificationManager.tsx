'use client'

import { useQuery } from '@tanstack/react-query'
import { adminCertificationListQueryOptions } from '@/entities/certification'
import { CertificationUploadSection } from './CertificationUploadSection'
import { CertificationGridSection } from './CertificationGridSection'

/**
 * 특허·인증서 관리 위젯(업로드 + 그리드 섹션 조합).
 *
 * 목록은 캐시버스터를 붙인 어드민 옵션으로 조회한다 — 공개 GET의 HTTP 캐시(max-age=60)로
 * 삭제/추가 직후 낡은 목록이 보이는 회귀를 우회한다(certificationApi.ts 주석 참조).
 *
 * 통합 콘솔 `/console/diagnosis`의 "특허·인증서" 탭에서 소비된다.
 * 페이지 헤더는 뷰(AdminDiagnosisView)가 단일 관리하므로 이 위젯은 헤더를 렌더하지 않는다.
 */
export function AdminCertificationManager() {
  const { data: certifications = [], isLoading } = useQuery(
    adminCertificationListQueryOptions(),
  )

  return (
    <div className="flex flex-col gap-8">
      <CertificationUploadSection />
      <CertificationGridSection
        certifications={certifications}
        isLoading={isLoading}
      />
    </div>
  )
}
