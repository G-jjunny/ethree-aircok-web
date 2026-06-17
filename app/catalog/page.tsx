import type { Metadata } from 'next'
import { SITE } from '@/shared/config'
import { CatalogView } from '@/views/catalog'

export const metadata: Metadata = {
  title: SITE.pages.catalog.title,
  description: SITE.pages.catalog.description,
  openGraph: {
    title: SITE.pages.catalog.title,
    description: SITE.pages.catalog.description,
    url: `${SITE.url}/catalog`,
  },
}

export default function CatalogPage() {
  return <CatalogView />
}
