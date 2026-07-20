import { Suspense } from 'react'
import { AdminAboutView } from '@/views/admin-about'

export default function AdminAboutPage() {
  return (
    <Suspense fallback={null}>
      <AdminAboutView />
    </Suspense>
  )
}
