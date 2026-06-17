import type { Metadata } from 'next'
import { SITE } from '@/shared/config'
import { HealthReportView } from '@/views/health-report'

export const metadata: Metadata = {
  title: SITE.pages.healthReport.title,
  description: SITE.pages.healthReport.description,
  openGraph: {
    title: SITE.pages.healthReport.title,
    description: SITE.pages.healthReport.description,
    url: `${SITE.url}/health-report`,
  },
}

export default function HealthReportPage() {
  return <HealthReportView />
}
