import type { Metadata } from 'next'
import { SITE } from '@/shared/config'
import { PricingView } from '@/views/pricing'

export const metadata: Metadata = {
  title: SITE.pages.pricing.title,
  description: SITE.pages.pricing.description,
  openGraph: {
    title: SITE.pages.pricing.title,
    description: SITE.pages.pricing.description,
    url: `${SITE.url}/pricing`,
  },
}

export default function PricingPage() {
  return <PricingView />
}
