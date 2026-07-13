import Link from 'next/link';
import { NewsImage } from '@/shared/ui';
import type { NewsPost } from '@/entities/news';
import { formatNewsDate } from '../lib/formatNewsDate';

interface Props {
  post: NewsPost;
}

/** ← 아이콘 (목록으로) */
function BackIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
    </svg>
  );
}

/**
 * 뉴스 상세 헤더.
 * 목록으로 버튼 → 타입 배지 → 제목 → 메타(날짜) → 대표 이미지 순으로 렌더한다.
 * coverImage가 없으면 NewsImage가 폴백 플레이스홀더를 표시한다.
 */
export function NewsDetailHeroSection({ post }: Props) {
  const badgeLabel = post.type === 'LINK' ? '외부 링크' : '게시글';

  return (
    <header>
      {/* 목록으로 */}
      <Link
        href="/news"
        className="inline-flex items-center gap-1.5 rounded-btn border border-hairline px-4 py-2 text-sm font-semibold text-muted transition-colors hover:bg-surface hover:text-ink"
      >
        <BackIcon />
        목록으로
      </Link>

      {/* 타입 배지 */}
      <div className="mt-7">
        <span className="inline-block rounded-pill border border-tint-border bg-tint px-3 py-1 text-xs font-bold text-brand">
          {badgeLabel}
        </span>
      </div>

      {/* 제목 */}
      <h1 className="mt-4 text-h5 font-extrabold leading-tight tracking-headline text-ink [word-break:keep-all] [text-wrap:pretty]">
        {post.title}
      </h1>

      {/* 메타 */}
      <div className="mt-4 border-b border-hairline pb-6 text-sm text-muted">
        <time dateTime={post.date}>{formatNewsDate(post.date)}</time>
      </div>

      {/* 대표 이미지 */}
      <div className="mt-7 overflow-hidden rounded-card">
        <NewsImage src={post.coverImage} alt={post.title} ratio="video" priority />
      </div>
    </header>
  );
}
