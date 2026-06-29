import { SITE } from '@/shared/config'
import { PageHero } from '@/shared/ui'

export function SubHeroSection() {
  return (
    <PageHero
      label="Products"
      title={SITE.pages.services.title}
      body={SITE.pages.services.description}
    />
  )
}
