import type { Metadata } from 'next'
import { SITE } from '@/shared/config'
import { FaqView } from '@/views/faq'

export const metadata: Metadata = {
  title: SITE.pages.faq.title,
  description: SITE.pages.faq.description,
  openGraph: {
    title: SITE.pages.faq.title,
    description: SITE.pages.faq.description,
    url: `${SITE.url}/faq`,
  },
}

export default function FaqPage() {
  return <FaqView />
}
