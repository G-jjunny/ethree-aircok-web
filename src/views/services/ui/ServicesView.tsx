import { Suspense } from 'react'
import { SubHeroSection } from './SubHeroSection'
import { ServiceImageGallerySection } from './ServiceImageGallerySection'

export function ServicesView() {
  return (
    <main>
      <SubHeroSection />
      <Suspense fallback={<div className="min-h-[400px] bg-surface-white" />}>
        <ServiceImageGallerySection />
      </Suspense>
    </main>
  )
}
