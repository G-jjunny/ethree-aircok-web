import { SITE } from '@/shared/config'
import { PageHero } from '@/shared/ui'

export function PageHeroSection() {
  return (
    <PageHero
      label={SITE.about.hero.label}
      title={SITE.about.hero.headline}
      body={SITE.about.hero.body}
    />
  )
}
