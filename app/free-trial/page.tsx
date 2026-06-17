import type { Metadata } from 'next'
import { SITE } from '@/shared/config'
import { FreeTrialView } from '@/views/free-trial'

export const metadata: Metadata = {
  title: SITE.pages.freeTrial.title,
  description: SITE.pages.freeTrial.description,
  openGraph: {
    title: SITE.pages.freeTrial.title,
    description: SITE.pages.freeTrial.description,
    url: `${SITE.url}/free-trial`,
  },
}

export default function FreeTrialPage() {
  return <FreeTrialView />
}
