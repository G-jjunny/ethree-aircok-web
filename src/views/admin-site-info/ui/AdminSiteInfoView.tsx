import { SiteInfoFormSection } from './SiteInfoFormSection'
import { PartnerListSection } from './PartnerListSection'

export function AdminSiteInfoView() {
  return (
    <div>
      {/* 페이지 헤더 */}
      <div className="bg-surface-white border-b border-border-light px-6 lg:px-8 py-5">
        <h1 className="text-[22px] font-display font-semibold text-heading-dark leading-tight [word-break:keep-all]">
          사이트 설정
        </h1>
      </div>

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
