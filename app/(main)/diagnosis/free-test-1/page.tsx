import type { Metadata } from 'next'
import { SITE } from '@/shared/config'
import { FreeTest1View } from '@/views/diagnosis'

export const metadata: Metadata = {
  title: SITE.pages.diagnosisFreeTest1.title,
  description: SITE.pages.diagnosisFreeTest1.description,
  openGraph: {
    title: SITE.pages.diagnosisFreeTest1.title,
    description: SITE.pages.diagnosisFreeTest1.description,
    url: `${SITE.url}/diagnosis/free-test-1`,
  },
}

export default function FreeTest1Page() {
  return <FreeTest1View />
}
