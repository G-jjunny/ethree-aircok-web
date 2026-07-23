import { Suspense } from 'react'
import { SITE } from '@/shared/config'
import { SectionLabel } from '@/shared/ui'
import { MissionImage, MissionImageFallback } from './MissionImage'

/**
 * MISSION (시안 §MISSION). 흰 배경, 좌 텍스트 / 우 이미지(ABOUT_MISSION 슬롯).
 * 섹션은 정적 프레젠테이션이며, 이미지 자리만 async 데이터 컴포넌트를 Suspense 로 감싼다
 * (슬롯 미등록 시 기존 플레이스홀더가 그대로 폴백).
 */
export function MissionSection() {
  const { eyebrow, title, body } = SITE.about.mission

  return (
    <section className="bg-surface-white py-24">
      <div className="content-container grid items-start gap-14 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionLabel color="brand">{eyebrow}</SectionLabel>
          <h2 className="mt-4 text-h5 font-extrabold tracking-headline text-ink">
            {title}
          </h2>
          <p className="mt-5 text-lead-sm leading-relaxed text-muted">{body}</p>
        </div>

        <Suspense fallback={<MissionImageFallback />}>
          <MissionImage />
        </Suspense>
      </div>
    </section>
  )
}
