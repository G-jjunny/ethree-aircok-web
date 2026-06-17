import type { Metadata } from 'next'
import { SITE } from '@/shared/config'
import { ProjectsView } from '@/views/projects'

export const metadata: Metadata = {
  title: SITE.pages.projects.title,
  description: SITE.pages.projects.description,
  openGraph: {
    title: SITE.pages.projects.title,
    description: SITE.pages.projects.description,
    url: `${SITE.url}/projects`,
  },
}

export default function ProjectsPage() {
  return <ProjectsView />
}
