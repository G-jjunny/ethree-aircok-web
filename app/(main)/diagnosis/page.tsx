import type { Metadata } from 'next'
import { SITE } from '@/shared/config'
import { DiagnosisView } from '@/views/diagnosis'

export const metadata: Metadata = {
  title: SITE.pages.diagnosis.title,
  description: SITE.pages.diagnosis.description,
  openGraph: {
    title: SITE.pages.diagnosis.title,
    description: SITE.pages.diagnosis.description,
    url: `${SITE.url}/diagnosis`,
  },
}

export default function DiagnosisPage() {
  return <DiagnosisView />
}
