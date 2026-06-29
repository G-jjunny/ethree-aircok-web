import { AdminPageHeader } from '@/shared/ui'
import { AdminMapSettingView } from '@/widgets/admin-map-setting'
import { SiteInfoFormSection } from './SiteInfoFormSection'
import { PartnerListSection } from './PartnerListSection'

export function AdminSiteInfoView() {
  return (
    <div>
      <AdminPageHeader title="사이트 설정" description="회사 기본 정보, 파트너사 목록, 지도 설정을 관리합니다." />

      {/* 콘텐츠 영역 */}
      <div className="p-6 lg:p-8">
        <div className="max-w-[900px] flex flex-col gap-8"> {/* token 없음: 사이트 설정 어드민 전용 중간 너비 */}
          <SiteInfoFormSection />
          <PartnerListSection />
          {/* 지도 설정 섹션 */}
          <section>
            {/* token 없음: 17px Body 스케일 — globals.css에 --font-size-body 미정의, Tailwind 기본 text-base(16px)·text-lg(18px) 사이 수치 */}
            <h2 className="text-[17px] font-display font-semibold text-heading-dark mb-4 [word-break:keep-all]">지도 설정</h2>
            <AdminMapSettingView />
          </section>
        </div>
      </div>
    </div>
  )
}
