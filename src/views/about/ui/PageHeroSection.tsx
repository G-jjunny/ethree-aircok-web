import { SITE } from '@/shared/config'
import { SectionHeader } from '@/shared/ui'

export function PageHeroSection() {
  return (
    <section className="bg-surface-dark">
      <div className="max-w-[1200px] mx-auto px-5 min-h-[480px] flex items-center">
        <div className="py-20">
          <SectionHeader
            label={SITE.about.hero.label}
            title={SITE.about.hero.headline}
            body={SITE.about.hero.body}
            theme="dark"
            titleAs="h1"
          />
        </div>
      </div>
    </section>
  )
}
