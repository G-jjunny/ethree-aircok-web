import type { Metadata } from 'next'
import { SITE } from '@/shared/config'
import { AboutView } from '@/views/about'

export const metadata: Metadata = {
  title: SITE.pages.about.title,
  description: SITE.pages.about.description,
  openGraph: {
    title: SITE.pages.about.title,
    description: SITE.pages.about.description,
    url: `${SITE.url}/about`,
  },
}

export default function AboutPage() {
  return <AboutView />
}
