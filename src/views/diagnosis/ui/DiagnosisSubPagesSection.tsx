import Link from 'next/link'
import { SectionHeader } from '@/shared/ui'

export function DiagnosisSubPagesSection() {
  return (
    <section className="bg-surface-light py-20">
      <div className="content-container">
        <div className="flex flex-col items-center gap-8">
          <SectionHeader
            title="신청하기"
            theme="light"
            titleAs="h2"
            align="center"
          />
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {/* Primary Blue 버튼 패턴 — design.md "Buttons > Primary Blue" 참조 */}
            <Link
              href="/diagnosis/free-test-1"
              className="bg-aircok-blue text-heading-light text-[17px] font-medium rounded-md px-5 py-[10px] hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors min-h-[44px] inline-flex items-center justify-center"
            >
              무료 테스트1 신청
            </Link>
            <Link
              href="/diagnosis/free-test-2"
              className="bg-aircok-blue text-heading-light text-[17px] font-medium rounded-md px-5 py-[10px] hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors min-h-[44px] inline-flex items-center justify-center"
            >
              무료 테스트2 신청
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
