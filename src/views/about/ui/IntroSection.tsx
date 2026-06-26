import { SITE } from '@/shared/config'
import { SectionHeader, FeatureCard } from '@/shared/ui'

export function IntroSection() {
  return (
    <section className="bg-surface-white py-24">
      <div className="content-container flex flex-col gap-14">
        <SectionHeader
          label={SITE.about.intro.label}
          title={SITE.about.intro.title}
          body={SITE.about.intro.body}
          theme="light"
          maxWidth="max-w-[760px]"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
