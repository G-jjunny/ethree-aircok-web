import { Suspense } from 'react'
import type { Metadata } from 'next'
import { SITE } from '@/shared/config'
import { NewsView } from '@/views/news'

export const metadata: Metadata = {
  title: SITE.pages.news.title,
  description: SITE.pages.news.description,
  alternates: {
    canonical: '/news',
  },
  openGraph: {
    title: SITE.pages.news.title,
    description: SITE.pages.news.description,
    url: `${SITE.url}/news`,
  },
}

export default function NewsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-white" />}>
      <NewsView />
    </Suspense>
  )
}
