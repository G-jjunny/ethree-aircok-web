import { redirect } from 'next/navigation'

// /projects는 diagnosis로 이전된 deprecated 경로다.
// SEO 중복/유령 페이지 방지를 위해 진단 페이지로 영구 리다이렉트한다.
// (app/(main)/catalog/3d → /catalog 리다이렉트 패턴과 동일. sitemap.ts에서도 제외됨.)
export default function ProjectsPage() {
  redirect('/diagnosis')
}
