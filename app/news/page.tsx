import type { Metadata } from 'next'
import { SITE } from '@/shared/config'
import { NewsView } from '@/views/news'

export const metadata: Metadata = {
  title: SITE.pages.news.title,
  description: SITE.pages.news.description,
  openGraph: {
    title: SITE.pages.news.title,
    description: SITE.pages.news.description,
    url: `${SITE.url}/news`,
  },
}

export default function NewsPage() {
  return <NewsView />
}
