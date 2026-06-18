import { SITE } from '@/shared/config'
import { SectionHeader, FeatureCard } from '@/shared/ui'

export function IntroSection() {
  return (
    <section className="bg-surface-white py-20">
      <div className="content-container">
        <div className="mb-12">
          <SectionHeader
            label={SITE.about.intro.label}
            title={SITE.about.intro.title}
            body={SITE.about.intro.body}
            theme="light"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SITE.about.intro.values.map((value) => (
            <FeatureCard
              key={value.title}
              title={value.title}
              description={value.description}
              theme="light"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
