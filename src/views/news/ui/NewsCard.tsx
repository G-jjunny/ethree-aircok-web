import Link from 'next/link';
import { NewsImage, PagePlaceholder } from '@/shared/ui';
import type { NewsSummary } from '@/entities/news';
import { formatNewsDate } from '../lib/formatNewsDate';

interface Props {
  item: NewsSummary;
}

/** 우상단 외부 링크 화살표(↗) 아이콘 */
function ExternalArrowIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}

/** CTA 우측 화살표(→) 아이콘 */
function ArrowRightIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** 타입 배지 — LINK: 다크 반투명 blur / BLOG: brand */
function TypeBadge({ type }: { type: NewsSummary['type'] }) {
  if (type === 'LINK') {
    return (
      <span className="rounded-pill bg-navy/70 px-3 py-1 text-mini font-bold text-white backdrop-blur-sm">
        외부 링크
      </span>
    );
  }
  return (
    <span className="rounded-pill bg-brand px-3 py-1 text-mini font-bold text-brand-ink">
      게시글
    </span>
  );
}

/**
 * 커버 이미지 영역. coverImage 있으면 NewsImage, 없으면 타입별 톤의 플레이스홀더.
 * (LINK=회색계 surface / BLOG=연블루계 tint)
 */
function CardThumb({ item }: Props) {
  const isLink = item.type === 'LINK';

  return (
    <div className="relative">
      {item.coverImage ? (
        <NewsImage src={item.coverImage} alt={item.title} ratio="card" />
      ) : (
        // coverImage 없을 때 표준 줄무늬 폴백 (link=회색계 surface / post=연블루계 tint)
        <PagePlaceholder
          variant={isLink ? 'surface' : 'tint'}
          bordered={false}
          rounded="rounded-none"
          className="aspect-card w-full"
          label={isLink ? 'External Link' : 'Aircok News'}
        />
      )}

      {/* 좌상단 타입 배지 */}
      <div className="absolute left-3 top-3">
        <TypeBadge type={item.type} />
      </div>

      {/* LINK: 우상단 외부 링크 아이콘 */}
      {isLink && (
        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface-white/90 text-brand shadow-md">
          <ExternalArrowIcon />
        </div>
      )}
    </div>
  );
}

/** 카드 본문(메타/제목/설명/CTA) */
function CardBody({ item }: Props) {
  const isLink = item.type === 'LINK';

  return (
    <div className="flex flex-1 flex-col p-6">
      {/* 메타: 타입 라벨 · 날짜 */}
      <div className="flex items-center gap-2 text-meta">
        <span className="font-bold text-ink">{isLink ? '외부 링크' : '게시글'}</span>
        <span className="text-faint">·</span>
        <time className="text-muted" dateTime={item.date}>
          {formatNewsDate(item.date)}
        </time>
      </div>

      <h3 className="mt-2.5 text-lg font-extrabold leading-snug tracking-headline text-ink line-clamp-2">
        {item.title}
      </h3>

      {item.description && (
        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted line-clamp-2">
          {item.description}
        </p>
      )}

      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand">
        {isLink ? '기사 원문 보기' : '게시글 읽기'}
        <ArrowRightIcon />
      </span>
    </div>
  );
}

/**
 * 뉴스 카드. LINK 타입은 외부 URL을 새 탭으로 여는 <a>,
 * BLOG 타입은 내부 상세(`/news/[id]`)로 이동하는 next/link <Link>로 분기한다.
 */
export function NewsCard({ item }: Props) {
  const cardClass =
    'group flex flex-col overflow-hidden rounded-image border border-hairline bg-surface-white shadow-soft ' +
    'transition-all duration-fast ease-out hover:-translate-y-1 hover:shadow-float';

  const inner = (
    <>
      <CardThumb item={item} />
      <CardBody item={item} />
    </>
  );

  if (item.type === 'LINK' && item.externalUrl) {
    return (
      <a
        href={item.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClass}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={`/news/${item.id}`} className={cardClass}>
      {inner}
    </Link>
  );
}
