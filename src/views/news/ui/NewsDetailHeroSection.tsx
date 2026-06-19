import Link from 'next/link';
import type { NewsPost } from '@/entities/news';

interface Props {
  post: NewsPost;
  API_BASE: string;
}

function formatDate(dateStr: string): string {
  return dateStr.slice(0, 10).replace(/-/g, '.');
}

export function NewsDetailHeroSection({ post, API_BASE }: Props) {
  return (
    <>
      {/* 뒤로가기 바 */}
      <div className="content-container py-5">
        <Link
          href="/news"
          className="text-secondary-dark text-sm hover:text-body-dark transition-colors"
        >
          ← 뉴스 목록
        </Link>
      </div>

      {/* Hero 영역 */}
      <section className="bg-surface-light py-14">
        <div className="content-container">
          {/* 날짜 + 장소 뱃지 row */}
          <div className="flex items-center gap-2 flex-wrap">
            <time className="bg-surface-white rounded-pill px-3 py-1 text-xs text-secondary-dark border border-border-light">
              {formatDate(post.date)}
            </time>
            {post.location && (
              <span className="bg-surface-white rounded-pill px-3 py-1 text-xs text-secondary-dark border border-border-light">
                📍 {post.location}
              </span>
            )}
          </div>

          {/* 제목 */}
          <h1 className="text-heading-dark font-display font-bold text-[36px] md:text-[48px] leading-tight mt-4 max-w-3xl [word-break:keep-all]">
            {post.title}
          </h1>

          {/* 설명 */}
          {post.description && (
            <p className="text-body-dark font-body text-lg mt-4 max-w-2xl [word-break:keep-all]">
              {post.description}
            </p>
          )}
        </div>
      </section>

      {/* 커버 이미지 */}
      {post.coverImage && (
        <div className="content-container">
          <div className="mt-10 rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                post.coverImage.startsWith('http')
                  ? post.coverImage
                  : `${API_BASE}${post.coverImage}`
              }
              alt={post.title}
              className="w-full max-h-[520px] object-cover"
            />
          </div>
        </div>
      )}
    </>
  );
}
