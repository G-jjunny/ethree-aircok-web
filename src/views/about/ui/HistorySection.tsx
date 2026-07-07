import { connection } from 'next/server'
import { SITE } from '@/shared/config'
import { SectionHeader } from '@/shared/ui'
import { getTimelineListServer, type TimelineItem } from '@/entities/timeline'
import { HistoryTimeline } from './HistoryTimeline'

export async function HistorySection() {
  // 빌드 타임 프리렌더(백엔드 미기동)에서 fetch가 실행되지 않도록 요청 시점으로 미룬다.
  await connection()

  let timelines: TimelineItem[] = []
  try {
    timelines = await getTimelineListServer()
  } catch {
    // 실패 시 빈 배열 → HistoryTimeline leaf가 SITE.about.history 폴백으로 정규화한다.
    timelines = []
  }

  return (
    <section className="bg-surface-white py-24">
      <div className="content-container flex flex-col gap-14">
        <SectionHeader
          label={SITE.about.history.label}
          title={SITE.about.history.title}
          theme="light"
        />
        <HistoryTimeline timelines={timelines} />
      </div>
    </section>
  )
}
