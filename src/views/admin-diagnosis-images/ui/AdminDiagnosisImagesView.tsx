import { AdminDiagnosisConsultationListView } from '@/widgets/admin-diagnosis-consultation-list'
import { AdminPageHeader } from '@/shared/ui'

export function AdminDiagnosisImagesView() {
  return (
    <div>
      <AdminPageHeader
        title="진단서비스 신청현황"
        description="진단서비스 페이지의 상담 신청 내역을 관리합니다."
      />

      <div className="p-6 lg:p-8">
        <AdminDiagnosisConsultationListView />
      </div>
    </div>
  )
}
