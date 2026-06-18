import { SubHeroSection } from './SubHeroSection'
import { ProductsIntroSection } from './ProductsIntroSection'
import { ServiceImage1Section } from './ServiceImage1Section'
import { ServiceImage2Section } from './ServiceImage2Section'

export function ServicesView() {
  return (
    <main>
      <SubHeroSection />
      <ProductsIntroSection />
      <ServiceImage1Section />
      <ServiceImage2Section />
    </main>
  )
}
