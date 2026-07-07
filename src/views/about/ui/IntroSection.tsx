import { connection } from 'next/server'
import { getCoreValueListServer, type CoreValue } from '@/entities/core-value'
import { SITE } from '@/shared/config'
import { SectionHeader } from '@/shared/ui'
import { ValueCardStack } from './ValueCardStack'

export async function IntroSection() {
  // 빌드 타임 프리렌더(백엔드 미기동)에서 fetch가 실행되지 않도록 요청 시점으로 미룬다.
  await connection()

  let coreValues: CoreValue[] = []
  try {
    coreValues = await getCoreValueListServer()
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
