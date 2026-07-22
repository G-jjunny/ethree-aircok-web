import { SectionHeader } from '@/shared/ui'
import { DiagnosisForm } from '@/features/diagnosis'

export function DiagnosisFormSection() {
  return (
    <section className="bg-surface-white py-20">
      <div className="content-container">
        <SectionHeader
          label="상담 신청"
          title="진단서비스 상담 신청"
          theme="light"
          titleAs="h2"
          align="center"
        />
        {/* max-w-[640px]: 폼 최적 가독 너비, 1회성 레이아웃 수치 — 토큰 없음 */}
        <div className="max-w-[640px] mx-auto mt-12">
          <DiagnosisForm />
        </div>
      </div>
    </section>
  )
}
