import { SectionHeader } from './SectionHeader'

type PageHeroProps = {
  label: string
  title: string
  body?: string
  titleAs?: 'h1' | 'h2'
  maxWidth?: string
}

/**
 * 서브 페이지 상단의 텍스트 전용 히어로.
 * About 페이지 디자인을 표준으로 통일한 단일 구현체.
 * - 다크 셸(`bg-surface-dark`) + `min-h-[480px] flex items-center`
 * - Air Spine 시그니처(좌측 수직 `bg-aircok-blue` 룰)
 * - SectionHeader(theme="dark")를 내부 조합 — 중복 마크업 없음
 */
export function PageHero({
  label,
  title,
  body,
  titleAs = 'h1',
  maxWidth = 'max-w-[760px]',
}: PageHeroProps) {
  return (
    <section className="bg-surface-dark">
      <div className="content-container min-h-[480px] flex items-center">
        {/* Air Spine signature — 좌측 수직 룰로 콘텐츠를 정렬 */}
        <div className="flex items-stretch gap-6 py-20 md:gap-8">
          <span
            aria-hidden="true"
            className="mt-1.5 block w-0.5 shrink-0 self-stretch bg-aircok-blue"
          />
          <SectionHeader
            label={label}
            title={title}
            body={body}
            theme="dark"
            titleAs={titleAs}
            maxWidth={maxWidth}
          />
        </div>
      </div>
    </section>
  )
}
