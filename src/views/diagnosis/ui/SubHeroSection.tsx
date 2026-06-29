import { PageHero } from '@/shared/ui'

type SubHeroSectionProps = {
  label: string
  title: string
  description: string
}

export function SubHeroSection({ label, title, description }: SubHeroSectionProps) {
  return <PageHero label={label} title={title} body={description} />
}
