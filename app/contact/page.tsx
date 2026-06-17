import type { Metadata } from 'next'
import { SITE } from '@/shared/config'
import { ContactView } from '@/views/contact'

export const metadata: Metadata = {
  title: SITE.pages.contact.title,
  description: SITE.pages.contact.description,
  openGraph: {
    title: SITE.pages.contact.title,
    description: SITE.pages.contact.description,
    url: `${SITE.url}/contact`,
  },
}

export default function ContactPage() {
  return <ContactView />
}
