import { SITE } from '@/shared/config'
import { SectionHeader } from '@/shared/ui'

// 데이터 연동(Phase 2) 전까지 표시할 자리표시 카드 — 구조 유지
const TEAM_PLACEHOLDERS = ['첫번째 팀원', '두번째 팀원', '세번째 팀원'] as const

export function TeamSection() {
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
        {/* 팀 카드 placeholder 3열 그리드 (Team Member Placeholder Card) */}
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
      </div>
    </section>
  )
}
