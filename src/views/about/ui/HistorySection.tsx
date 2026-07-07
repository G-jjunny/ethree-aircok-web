import { connection } from 'next/server'
import { cacheLife, cacheTag } from 'next/cache'
import { SITE } from '@/shared/config'
import { SectionHeader } from '@/shared/ui'
import { getTimelineListServer, TIMELINE_CACHE_TAG, type TimelineItem } from '@/entities/timeline'
import { HistoryTimeline } from './HistoryTimeline'

/** 연혁 조회를 'use cache'로 캐싱(cacheTag: 'timeline', cacheLife: static). */
async function getCachedTimeline(): Promise<TimelineItem[]> {
  'use cache'
  cacheLife('static')
  cacheTag(TIMELINE_CACHE_TAG)
  return getTimelineListServer()
}

export async function HistorySection() {
  // 빌드 타임 프리렌더(백엔드 미기동)에서 fetch가 실행되지 않도록 요청 시점으로 미룬다.
  await connection()

  let timelines: TimelineItem[] = []
  try {
    timelines = await getCachedTimeline()
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
