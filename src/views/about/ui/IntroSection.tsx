import { connection } from 'next/server'
import { cacheLife, cacheTag } from 'next/cache'
import { getCoreValueListServer, CORE_VALUES_CACHE_TAG, type CoreValue } from '@/entities/core-value'
import { SITE } from '@/shared/config'
import { SectionHeader } from '@/shared/ui'
import { ValueCardStack } from './ValueCardStack'

/** 핵심가치 조회를 'use cache'로 캐싱(cacheTag: 'core-values', cacheLife: static). */
async function getCachedCoreValues(): Promise<CoreValue[]> {
  'use cache'
  cacheLife('static')
  cacheTag(CORE_VALUES_CACHE_TAG)
  return getCoreValueListServer()
}

export async function IntroSection() {
  // 빌드 타임 프리렌더(백엔드 미기동)에서 fetch가 실행되지 않도록 요청 시점으로 미룬다.
  await connection()

  let coreValues: CoreValue[] = []
  try {
    coreValues = await getCachedCoreValues()
  } catch {
    coreValues = []
  }

  const hasValues = coreValues.length > 0

  return (
    <section className="bg-surface-white py-24">
      <div className="content-container flex flex-col gap-14">
        <SectionHeader
          label={SITE.about.intro.label}
          title={SITE.about.intro.title}
          body={SITE.about.intro.body}
          theme="light"
          maxWidth="max-w-[760px]"
        />

        {hasValues ? <ValueCardStack values={coreValues} /> : null}
      </div>
    </section>
  )
}
