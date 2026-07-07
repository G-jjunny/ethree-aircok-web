import type { Metadata } from 'next'
import { SITE } from '@/shared/config'
import { ServicesView } from '@/views/services'

export const metadata: Metadata = {
  title: SITE.pages.services.title,
  description: SITE.pages.services.description,
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: SITE.pages.services.title,
    description: SITE.pages.services.description,
    url: `${SITE.url}/services`,
  },
}

export default function ServicesPage() {
  return <ServicesView />
}
