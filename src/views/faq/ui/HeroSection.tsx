import { SectionHeader } from '@/shared/ui'

export function HeroSection() {
  return (
    <section className="bg-surface-dark">
      <div className="max-w-[1200px] mx-auto px-5 min-h-[480px] flex items-center">
        <div className="flex flex-col gap-4 py-20">
          <SectionHeader
            label="FAQ"
            title="자주 묻는 질문"
            theme="dark"
            titleAs="h1"
          />
        </div>
      </div>
    </section>
  )
}
