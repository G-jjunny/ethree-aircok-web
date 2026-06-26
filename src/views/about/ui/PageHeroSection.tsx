import { SITE } from '@/shared/config'
import { SectionHeader } from '@/shared/ui'

export function PageHeroSection() {
  return (
    <section className="bg-surface-dark">
      <div className="content-container min-h-[480px] flex items-center">
        {/* Air Spine signature — 좌측 수직 룰로 콘텐츠를 정렬 */}
        <div className="flex items-stretch gap-6 py-20 md:gap-8">
          <span
            aria-hidden="true"
            className="mt-1.5 block w-0.5 shrink-0 self-stretch bg-aircok-blue"
          />
          <SectionHeader
            label={SITE.about.hero.label}
            title={SITE.about.hero.headline}
            body={SITE.about.hero.body}
            theme="dark"
            titleAs="h1"
            maxWidth="max-w-[760px]"
          />
        </div>
      </div>
    </section>
  )
}
