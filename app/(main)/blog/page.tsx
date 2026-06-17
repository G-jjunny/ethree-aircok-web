import type { Metadata } from 'next'
import { SITE } from '@/shared/config'
import { BlogView } from '@/views/blog'

export const metadata: Metadata = {
  title: SITE.pages.blog.title,
  description: SITE.pages.blog.description,
  openGraph: {
    title: SITE.pages.blog.title,
    description: SITE.pages.blog.description,
    url: `${SITE.url}/blog`,
  },
}

export default function BlogPage() {
  return <BlogView />
}
