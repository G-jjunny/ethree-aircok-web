import { redirect } from 'next/navigation'
// 3D 뷰어 준비 완료 시 아래 주석을 해제하고 redirect를 제거하세요.
// import type { Metadata } from 'next'
// import { SITE } from '@/shared/config'
// import { Catalog3dView } from '@/views/catalog-3d'

// export const metadata: Metadata = {
//   title: `${SITE.pages.catalog.title} (3D)`,
//   description: SITE.pages.catalog.description,
//   openGraph: {
//     title: `${SITE.pages.catalog.title} (3D)`,
//     description: SITE.pages.catalog.description,
//     url: `${SITE.url}/catalog/3d`,
//   },
// }

export default function Catalog3dPage() {
  redirect('/catalog')
}
