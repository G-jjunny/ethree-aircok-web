import { SITE } from '@/shared/config'
import { SectionHeader } from '@/shared/ui'

export function TeamSection() {
  return (
    <section className="bg-surface-light py-20">
      <div className="content-container">
        <SectionHeader
          label={SITE.about.team.label}
          title={SITE.about.team.title}
          body={SITE.about.team.body}
          theme="light"
        />
        {/* 팀 카드 placeholder 3열 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {(['첫번째 팀원', '두번째 팀원', '세번째 팀원'] as const).map((label) => (
            <div
              key={label}
              className="bg-surface-white rounded-xl aspect-square flex items-center justify-center"
            >
              <p className="text-secondary-dark text-sm [word-break:keep-all] text-center px-6">
                팀원 사진 준비 중
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
