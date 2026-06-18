import type { Metadata } from 'next'
import { SITE } from '@/shared/config'
import { FreeTest2View } from '@/views/diagnosis'

export const metadata: Metadata = {
  title: SITE.pages.diagnosisFreeTest2.title,
  description: SITE.pages.diagnosisFreeTest2.description,
  openGraph: {
    title: SITE.pages.diagnosisFreeTest2.title,
    description: SITE.pages.diagnosisFreeTest2.description,
    url: `${SITE.url}/diagnosis/free-test-2`,
  },
}

export default function FreeTest2Page() {
  return <FreeTest2View />
}
