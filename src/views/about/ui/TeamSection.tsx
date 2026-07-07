import Image from 'next/image'
import { connection } from 'next/server'
import { cacheLife, cacheTag } from 'next/cache'
import { getTeamImageListServer, TEAM_IMAGES_CACHE_TAG, type TeamImage } from '@/entities/team-image'
import { SITE } from '@/shared/config'
import { SectionHeader } from '@/shared/ui'

/** 팀 이미지 조회를 'use cache'로 캐싱(cacheTag: 'team-images', cacheLife: default). */
async function getCachedTeamImages(): Promise<TeamImage[]> {
  'use cache'
  cacheLife('default')
  cacheTag(TEAM_IMAGES_CACHE_TAG)
  return getTeamImageListServer()
}

/** R2(http)는 그대로, 상대 경로(/uploads)는 동일 출처 rewrite로 서빙되도록 상대 유지. */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
function resolveSrc(src: string): string {
  if (src.startsWith('http')) return src
  return src.startsWith('/') ? src : `${API_BASE}${src}`
}

/** 데이터 없음/에러 시 표시할 단일 플레이스홀더 카드. */
function TeamPlaceholder() {
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 rounded-xl bg-surface-white p-8 text-center">
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
          팀 이미지 준비 중
        </p>
        <p className="text-sm text-secondary-dark">곧 업데이트될 예정입니다</p>
      </div>
    </div>
  )
}

export async function TeamSection() {
  // 빌드 타임 프리렌더(백엔드 미기동)에서 fetch가 실행되지 않도록 요청 시점으로 미룬다.
  await connection()

  let images: TeamImage[] = []
  try {
    images = await getCachedTeamImages()
  } catch {
    images = []
  }

  const firstImage = images.length > 0 ? images[0] : null

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

        {/* token 없음: max-w-3xl — 팀 이미지 포컬 너비, 전체 1200px 컨테이너보다 좁은 1회성 레이아웃 수치 */}
        {firstImage ? (
          <div className="max-w-3xl mx-auto w-full overflow-hidden rounded-xl">
            <div className="relative aspect-video w-full overflow-hidden bg-surface-light">
              <Image
                src={resolveSrc(firstImage.imageUrl)}
                alt={SITE.about.team.title}
                fill
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full">
            <TeamPlaceholder />
          </div>
        )}
      </div>
    </section>
  )
}
