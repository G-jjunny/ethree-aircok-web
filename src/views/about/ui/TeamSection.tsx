'use client'

import { useQuery } from '@tanstack/react-query'
import { SITE } from '@/shared/config'
import { SectionHeader } from '@/shared/ui'
import { teamImageListQueryOptions } from '@/entities/team-image'

// 데이터 없음/로딩/에러 시 표시할 자리표시 카드 — Phase 1 구조 보존
const TEAM_PLACEHOLDERS = ['첫번째 팀원', '두번째 팀원', '세번째 팀원'] as const

/** 이미지 항목은 백엔드 절대 URL로 보정한다(catalog/news 패턴). */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
function resolveSrc(src: string): string {
  return src.startsWith('http') ? src : `${API_BASE}${src}`
}

/** 등록 이미지 개수별 그리드 레이아웃: 1개=단일 대형(중앙), 2개=2열, 3개=3열. */
function gridClassForCount(count: number): string {
  // max-w-[640px]/[860px] {/* token 없음: 1·2개 그리드의 중앙 정렬 폭 제한 — 카드가 과도하게 커지지 않도록 하는 About 전용 1회성 수치 */}
  if (count === 1) return 'mx-auto grid max-w-[640px] grid-cols-1'
  if (count === 2) return 'mx-auto grid max-w-[860px] grid-cols-1 sm:grid-cols-2'
  return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
}

/** 빈배열/로딩/에러 시 폴백할 placeholder 3열 그리드. */
function TeamPlaceholderGrid() {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {TEAM_PLACEHOLDERS.map((label) => (
        <li
          key={label}
          className="group flex aspect-square flex-col items-center justify-center gap-4 rounded-xl bg-surface-white p-8 text-center transition-colors duration-200 hover:bg-surface-light"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-pill bg-surface-light">
            <svg
              className="h-8 w-8 text-secondary-dark"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </span>
          <div className="flex flex-col gap-1">
            <p className="text-subheading font-semibold text-heading-dark [word-break:keep-all]">
              팀원 합류 예정
            </p>
            <p className="text-sm text-secondary-dark">프로필 준비 중</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function TeamSection() {
  const { data: images = [], isLoading, isError } = useQuery(
    teamImageListQueryOptions(),
  )

  const hasImages = !isLoading && !isError && images.length > 0

  return (
    <section className="bg-surface-light py-24">
      <div className="content-container flex flex-col gap-14">
        <SectionHeader
          label={SITE.about.team.label}
          title={SITE.about.team.title}
          body={SITE.about.team.body}
          theme="light"
          maxWidth="max-w-[760px]"
        />

        {hasImages ? (
          <ul className={`${gridClassForCount(images.length)} gap-6`}>
            {images.map((image, index) => (
              <li
                key={image.id}
                className="overflow-hidden rounded-xl bg-surface-white"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-surface-light">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveSrc(image.imageUrl)}
                    alt={`${SITE.about.team.title} ${index + 1}`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <TeamPlaceholderGrid />
        )}
      </div>
    </section>
  )
}
