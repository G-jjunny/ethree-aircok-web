import Image from 'next/image'
import { Quote, User } from 'lucide-react'
import { connection } from 'next/server'
import { getServiceReviewListServer } from '@/entities/service-review/server'
import type { ServiceReview } from '@/entities/service-review'
import { SectionLabel } from '@/shared/ui'
import { resolveSrc } from './SlotImage'

const COPY = {
  eyebrow: 'REAL VOICES',
  title: '진단 서비스를 신청하신 이유',
  body: '서로 다른 공간, 서로 다른 고민. 에어콕은 각자의 이유에 정확한 답을 드립니다.',
  emptyLabel: '준비 중',
  emptyBody: '고객님들의 진단 신청 이유를 준비하고 있습니다.',
} as const

/** 후기 카드 아바타 — imageUrl 있으면 원형 next/image, 없으면 브랜드 톤 원형 + User 아이콘. */
function ReviewAvatar({ review }: { review: ServiceReview }) {
  if (review.imageUrl) {
    return (
      <div className="relative size-13 shrink-0 overflow-hidden rounded-full bg-tint">
        <Image
          src={resolveSrc(review.imageUrl)}
          alt={`${review.role} 프로필`}
          fill
          sizes="52px"
          className="object-cover"
        />
      </div>
    )
  }
  return (
    <div className="flex size-13 shrink-0 items-center justify-center rounded-full border border-tint-border bg-tint">
      <User className="size-6.5 text-brand" strokeWidth={1.6} aria-hidden />
    </div>
  )
}

/**
 * 마퀴 트랙에 실리는 고정 폭 후기 카드 — 기존 그리드 카드 마크업 재사용.
 * 폭: 모바일 w-72(288 — 360px 가용폭 296px 안에서 카드 1장이 온전히 보이도록 완화, #155) → sm 이상 w-88(352). LogoMarquee 의 w-40 대응(인용문 폭 확보 위해 확대).
 * flex-col + h-full 로 같은 행 카드 높이를 맞추고, 인용문은 line-clamp-3 로 캡, footer 는 mt-auto 로 하단 고정.
 */
function ReviewCard({ review }: { review: ServiceReview }) {
  return (
    <div className="flex h-full w-72 shrink-0 flex-col rounded-card border border-hairline bg-surface-white p-7.5 sm:w-88">
      <Quote className="size-7.5 text-hairline" aria-hidden />
      <p className="mt-4 text-sm leading-loose text-ink line-clamp-3">
        {review.quote}
      </p>
      <div className="mt-auto flex items-center gap-3.5 border-t border-hairline pt-5.5">
        <ReviewAvatar review={review} />
        <div>
          <div className="text-base font-extrabold text-ink">{review.role}</div>
          <div className="text-mini text-muted">{review.age}</div>
        </div>
      </div>
    </div>
  )
}

/**
 * 후기 마퀴 한 줄 — 목록을 2배 복제해 -50% 이동으로 끊김 없이 순환(CSS 애니메이션 전용).
 * 복제본(뒤쪽 절반)은 aria-hidden 처리해 스크린리더가 각 후기를 한 번만 읽게 한다.
 * hover 정지는 트랙 직접 hover(CSS-only), reduced-motion 정지는 globals.css 전역 처리.
 */
function ReviewMarqueeRow({
  reviews,
  direction,
}: {
  reviews: ServiceReview[]
  direction: 'left' | 'right'
}) {
  const doubled = [...reviews, ...reviews]
  return (
    <div className="overflow-hidden">
      <div
        className={`flex w-max items-stretch gap-4 ${
          direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
        } hover:[animation-play-state:paused]`}
      >
        {doubled.map((review, i) => (
          <div
            key={`${review.id}-${i}`}
            className="h-full"
            aria-hidden={i >= reviews.length || undefined}
          >
            <ReviewCard review={review} />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 진단 서비스 후기(신청 사유) — **async 서버 컴포넌트**(데이터).
 *
 * service-review 엔티티 서버 페처로 조회. 헤더는 항상 렌더하고, 목록이 비면 "준비 중" 폴백을
 * 렌더한다(섹션 자체는 유지). 카드 그리드는 가변 개수(1~N)에 대응한다.
 */
export async function ServiceReviewsSection() {
  await connection()

  let reviews: ServiceReview[] = []
  try {
    reviews = await getServiceReviewListServer()
  } catch {
    reviews = []
  }

  return (
    <section className="bg-surface py-24">
      <div className="content-container">
        <div className="flex flex-col items-center text-center">
          <SectionLabel color="brand">{COPY.eyebrow}</SectionLabel>
          <h2 className="mt-3 text-h6 sm:text-h5 font-extrabold tracking-headline text-ink">
            {COPY.title}
          </h2>
          {/* token 없음: max-w-[560px] 섹션 리드 프로즈 폭(1회성) */}
          <p className="mt-3.5 max-w-[560px] text-lead-sm leading-relaxed text-muted">
            {COPY.body}
          </p>
        </div>

        {reviews.length > 0 ? (
          <div role="group" aria-label={COPY.title} className="relative mt-13">
            <div className="flex flex-col gap-4">
              <ReviewMarqueeRow
                reviews={reviews.filter((_, i) => i % 2 === 0)}
                direction="left"
              />
              <ReviewMarqueeRow
                reviews={reviews.filter((_, i) => i % 2 === 1)}
                direction="right"
              />
            </div>
            {/* 양끝 페이드 — 섹션 배경(bg-surface)으로 자연스럽게 사라진다. pointer-events-none 으로 트랙 hover 정지 유지. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-surface to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-surface to-transparent"
            />
          </div>
        ) : (
          <div className="mt-13 flex flex-col items-center gap-2 rounded-card border border-hairline bg-surface-white px-7.5 py-16 text-center">
            <span className="font-display text-mini font-semibold uppercase tracking-eyebrow text-faint">
              {COPY.emptyLabel}
            </span>
            <p className="text-sm text-muted">{COPY.emptyBody}</p>
          </div>
        )}
      </div>
    </section>
  )
}
