import { connection } from 'next/server'
import { cacheLife, cacheTag } from 'next/cache'
import { SITE } from '@/shared/config'
import { SectionLabel } from '@/shared/ui'
import { getTimelineListServer, TIMELINE_CACHE_TAG, type TimelineItem } from '@/entities/timeline'
import { HistoryTimeline } from './HistoryTimeline'

/** 연혁 조회를 'use cache'로 캐싱(cacheTag: 'timeline', cacheLife: static). */
async function getCachedTimeline(): Promise<TimelineItem[]> {
  'use cache'
  cacheLife('static')
  cacheTag(TIMELINE_CACHE_TAG)
  return getTimelineListServer()
}

/**
 * HISTORY (시안 §HISTORY). surface 배경, 좌 라벨 + 우 타임라인.
 * timeline entity 리치 데이터(2018~2026)를 보존하고 신 토큰으로 리스킨만 한다.
 * 실패 시 HistoryTimeline leaf가 SITE.about.history.items 폴백으로 정규화한다.
 */
export async function HistorySection() {
  // 빌드 타임 프리렌더(백엔드 미기동)에서 fetch가 실행되지 않도록 요청 시점으로 미룬다.
  await connection()

  let timelines: TimelineItem[] = []
  try {
    timelines = await getCachedTimeline()
  } catch {
    timelines = []
  }

  const { eyebrow, title } = SITE.about.history

  return (
    <section className="bg-surface py-24">
      <div className="content-container grid gap-12 md:grid-cols-[220px_1fr]">
        {/* 좌: 라벨 (데스크탑 sticky). top-24(96px) 오프셋 = Nav 높이 + 여백 확보(표준 스페이싱 토큰) */}
        <div className="md:sticky md:top-24 md:self-start">
          <SectionLabel color="brand">{eyebrow}</SectionLabel>
          <h2 className="mt-4 text-h5 font-extrabold tracking-headline text-ink">
            {title}
          </h2>
        </div>

        {/* 우: 타임라인 */}
        <HistoryTimeline timelines={timelines} />
      </div>
    </section>
  )
}
