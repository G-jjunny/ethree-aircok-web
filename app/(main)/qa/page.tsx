import type { Metadata } from 'next'
import { SITE } from '@/shared/config'
import { QaView } from '@/views/qa'

export const metadata: Metadata = {
  title: SITE.pages.qa.title,
  description: SITE.pages.qa.description,
  openGraph: {
    title: SITE.pages.qa.title,
    description: SITE.pages.qa.description,
    url: `${SITE.url}/qa`,
  },
}

export default function QaPage() {
  return <QaView />
}
