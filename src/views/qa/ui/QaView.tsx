import { SITE } from '@/shared/config'

export function QaView() {
  return (
    <main className="min-h-screen bg-surface-white">
      <div className="max-w-[1200px] mx-auto px-5 py-20">
        <h1 className="text-heading-dark font-display text-[40px] font-semibold">
          {SITE.pages.qa.title}
        </h1>
        <p className="text-body-dark mt-4">콘텐츠 준비 중입니다.</p>
      </div>
    </main>
  )
}
