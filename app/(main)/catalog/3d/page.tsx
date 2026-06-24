import type { Metadata } from 'next'
import { SITE } from '@/shared/config'
import { Catalog3dView } from '@/views/catalog-3d'

export const metadata: Metadata = {
  title: `${SITE.pages.catalog.title} (3D)`,
  description: SITE.pages.catalog.description,
  openGraph: {
    title: `${SITE.pages.catalog.title} (3D)`,
    description: SITE.pages.catalog.description,
    url: `${SITE.url}/catalog/3d`,
  },
}

export default function Catalog3dPage() {
  return <Catalog3dView />
}
