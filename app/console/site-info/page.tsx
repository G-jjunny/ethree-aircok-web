import { Suspense } from 'react'
import { AdminSiteInfoView } from '@/views/admin-site-info'

export default function SiteInfoPage() {
  return (
    <Suspense fallback={null}>
      <AdminSiteInfoView />
    </Suspense>
  )
}
