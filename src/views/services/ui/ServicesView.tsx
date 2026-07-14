import { Suspense } from 'react'
import { PageHero } from '@/widgets/page-hero'
import { SITE } from '@/shared/config'
import { ServiceImageGallerySection } from './ServiceImageGallerySection'

export function ServicesView() {
  return (
    <main>
      <PageHero
        eyebrow={SITE.pages.services.hero.label}
        headline={{ prefix: SITE.pages.services.title }}
        body={SITE.pages.services.description}
      />
      <Suspense fallback={<div className="min-h-[400px] bg-surface-white" />}>
        <ServiceImageGallerySection />
      </Suspense>
    </main>
  )
}
