import { SITE } from '@/shared/config'
import { SectionLabel } from '@/shared/ui'
import { AboutPlaceholder } from './AboutPlaceholder'

/**
 * MISSION (시안 §MISSION). 흰 배경, 좌 텍스트 / 우 이미지(4/3 플레이스홀더).
 * 정적 콘텐츠 — 이미지 자산 미확보로 줄무늬 플레이스홀더 처리.
 */
export function MissionSection() {
  const { eyebrow, title, body } = SITE.about.mission

  return (
    <section className="bg-surface-white py-24">
      <div className="content-container grid items-center gap-14 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionLabel color="brand">{eyebrow}</SectionLabel>
          <h2 className="mt-4 text-h5 font-extrabold tracking-headline text-ink">
            {title}
          </h2>
          <p className="mt-5 text-lead-sm leading-relaxed text-muted">{body}</p>
        </div>

        <AboutPlaceholder
          className="aspect-row-thumb w-full rounded-card-lg"
          label="회사 · 팀 이미지 자리"
        />
      </div>
    </section>
  )
}
