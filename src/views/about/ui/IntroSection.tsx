'use client'

import { useQuery } from '@tanstack/react-query'
import { coreValueListQueryOptions } from '@/entities/core-value'
import { SITE } from '@/shared/config'
import { SectionHeader } from '@/shared/ui'
import { ValueCardStack } from './ValueCardStack'

export function IntroSection() {
  const { data: coreValues = [], isLoading, isError } = useQuery(coreValueListQueryOptions())

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

        {isLoading ? (
          // h-[500px]: token 없음 — ValueCardStack 스테이지(cardH+60, cardW=300 기준 450px)
          // + 네비게이션 버튼(mt-2 + h-11) 높이 근사, 스켈레톤 전용 1회성 수치
          <div className="h-[500px] rounded-xl bg-surface-light animate-pulse" />
        ) : isError ? null : hasValues ? (
          <ValueCardStack values={coreValues} />
        ) : null}
      </div>
    </section>
  )
}
