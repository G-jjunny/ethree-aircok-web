import Image from 'next/image'
import { connection } from 'next/server'
import { cacheLife, cacheTag } from 'next/cache'
import {
  getTeamImageListServer,
  TEAM_IMAGES_CACHE_TAG,
  type TeamImage,
} from '@/entities/team-image'
import {
  getCoreValueListServer,
  CORE_VALUES_CACHE_TAG,
  type CoreValue,
} from '@/entities/core-value'
import { SITE } from '@/shared/config'
import { SectionLabel } from '@/shared/ui'
import { AboutPlaceholder } from './AboutPlaceholder'

/** 팀 이미지 조회 캐싱(cacheTag: 'team-images'). */
async function getCachedTeamImages(): Promise<TeamImage[]> {
  'use cache'
  cacheLife('default')
  cacheTag(TEAM_IMAGES_CACHE_TAG)
  return getTeamImageListServer()
}

/** 핵심가치(신뢰 카드) 조회 캐싱(cacheTag: 'core-values'). */
async function getCachedCoreValues(): Promise<CoreValue[]> {
  'use cache'
  cacheLife('static')
  cacheTag(CORE_VALUES_CACHE_TAG)
  return getCoreValueListServer()
}

/** R2(http)는 그대로, 상대 경로(/uploads)는 동일 출처 rewrite. */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
function resolveSrc(src: string): string {
  if (src.startsWith('http')) return src
  return src.startsWith('/') ? src : `${API_BASE}${src}`
}

/** 표시용 신뢰 카드 형태 — API(CoreValue)와 SITE 폴백을 일원화. */
type TrustCard = { title: string; description: string }

/**
 * OUR TEAM (시안 §OUR TEAM). 흰 배경, 중앙 헤더 + 팀 사진(와이드) + 신뢰 3카드.
 * team-image entity → 팀 사진, core-value entity → 신뢰 3카드(둘 다 SITE 폴백 유지).
 */
export async function TeamSection() {
  // 빌드 타임 프리렌더(백엔드 미기동)에서 fetch가 실행되지 않도록 요청 시점으로 미룬다.
  await connection()

  let images: TeamImage[] = []
  try {
    images = await getCachedTeamImages()
  } catch {
    images = []
  }

  let coreValues: CoreValue[] = []
  try {
    coreValues = await getCachedCoreValues()
  } catch {
    coreValues = []
  }

  const { eyebrow, title, body, photoEyebrow, photoCaption, trustCards } =
    SITE.about.team

  const firstImage = images.length > 0 ? images[0] : null

  // core-value 데이터 우선, 없으면 SITE 폴백(어드민 편집성 + 정적 폴백 유지)
  const cards: TrustCard[] = (
    coreValues.length > 0
      ? coreValues.map((v) => ({ title: v.title, description: v.description }))
      : trustCards.map((c) => ({ title: c.title, description: c.description }))
  ).slice(0, 3)

  return (
    <section className="bg-surface-white py-24">
      <div className="content-container flex flex-col gap-12">
        {/* 중앙 헤더 — token 없음: max-w-[640px] 중앙 정렬 헤더 프로즈 폭(1회성) */}
        <div className="mx-auto max-w-[640px] text-center">
          <SectionLabel color="brand">{eyebrow}</SectionLabel>
          <h2 className="mt-4 text-h5 font-extrabold tracking-headline text-ink">
            {title}
          </h2>
          <p className="mt-4 text-lead-sm leading-relaxed text-muted">{body}</p>
        </div>

        {/* 팀 사진 (와이드) + 하단 그라디언트 오버레이 + 흰 텍스트 */}
        <div className="relative aspect-featured w-full overflow-hidden rounded-card-lg">
          {firstImage ? (
            <Image
              src={resolveSrc(firstImage.imageUrl)}
              alt={title}
              fill
              sizes="(min-width: 1240px) 1176px, 100vw"
              className="object-cover"
            />
          ) : (
            <AboutPlaceholder theme="dark" className="h-full w-full rounded-none" />
          )}
          {/* 하단 그라디언트 오버레이 — 흰 텍스트 대비 */}
          <div className="absolute inset-0 bg-linear-to-t from-navy-deep/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8">
            <SectionLabel color="cyan" size="sm">
              {photoEyebrow}
            </SectionLabel>
            {/* token 없음: max-w-[520px] 오버레이 캡션 프로즈 폭(1회성) */}
            <p className="mt-2 max-w-[520px] text-lg font-semibold leading-snug text-white">
              {photoCaption}
            </p>
          </div>
        </div>

        {/* 신뢰 3카드 */}
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col gap-3 rounded-2xl border border-hairline bg-surface p-6"
            >
              <h3 className="font-display text-base font-semibold text-brand">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
