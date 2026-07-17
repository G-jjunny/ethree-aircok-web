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
          <h2 className="mt-3 text-h5 font-extrabold tracking-headline text-ink">
            {COPY.title}
          </h2>
          {/* token 없음: max-w-[560px] 섹션 리드 프로즈 폭(1회성) */}
          <p className="mt-3.5 max-w-[560px] text-lead-sm leading-relaxed text-muted">
            {COPY.body}
          </p>
        </div>

        {reviews.length > 0 ? (
          <div className="mt-13 grid grid-cols-1 gap-5.5 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-card border border-hairline bg-surface-white px-7.5 py-8.5"
              >
                <Quote className="size-7.5 text-hairline" aria-hidden />
                <p className="mt-4 text-sm leading-loose text-ink">
                  {review.quote}
                </p>
                <div className="mt-6.5 flex items-center gap-3.5 border-t border-hairline pt-5.5">
                  <ReviewAvatar review={review} />
                  <div>
                    <div className="text-base font-extrabold text-ink">
                      {review.role}
                    </div>
                    <div className="text-mini text-muted">{review.age}</div>
                  </div>
                </div>
              </div>
            ))}
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
