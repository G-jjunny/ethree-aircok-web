import { AdminPageHeader } from '@/shared/ui'
import { SiteInfoFormSection } from './SiteInfoFormSection'
import { PartnerListSection } from './PartnerListSection'

export function AdminSiteInfoView() {
  return (
    <div>
      <AdminPageHeader title="사이트 설정" description="회사 기본 정보와 파트너사 목록을 관리합니다." />

      {/* 콘텐츠 영역 */}
      <div className="p-6 lg:p-8">
        <div className="max-w-[900px] flex flex-col gap-8"> {/* token 없음: 사이트 설정 어드민 전용 중간 너비 */}
          <SiteInfoFormSection />
          <PartnerListSection />
        </div>
      </div>
    </div>
  )
}
