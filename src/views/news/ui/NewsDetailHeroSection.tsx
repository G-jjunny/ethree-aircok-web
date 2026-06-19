import Link from 'next/link';
import { DateLabel, LocationTag, NewsImage } from '@/shared/ui';
import type { NewsPost } from '@/entities/news';

interface Props {
  post: NewsPost;
}

/**
 * 뉴스 상세 히어로.
 * coverImage 있으면 Overlay 변형 B(목록 featured hero와 통일), 없으면 라이트 변형 A 폴백.
 * design.md §4 "News Detail Hero".
 */
export function NewsDetailHeroSection({ post }: Props) {
  if (post.coverImage) {
    return <DetailHeroOverlay post={post} />;
  }
  return <DetailHeroLight post={post} />;
}

/** 변형 B — Overlay (coverImage 있음) */
function DetailHeroOverlay({ post }: Props) {
  return (
    <section className="relative">
      {/* token 없음: overlay hero 모바일 높이 캡 (기존 상세에서 쓰던 수치 계열) */}
      <NewsImage
        src={post.coverImage}
        alt={post.title}
        ratio="featured"
        className="max-h-[640px]"
      />
      <div className="absolute inset-0 bg-overlay-dark-60" />
      <div className="absolute inset-0 flex flex-col">
        {/* 뒤로가기 (다크 이미지 위 가독성) */}
        <div className="content-container py-5 w-full">
          <Link
            href="/news"
            className="text-body-light text-sm hover:text-heading-light transition-colors"
          >
            ← 뉴스 목록
          </Link>
        </div>
        {/* 콘텐츠 (하단 정렬) */}
        <div className="flex-1 flex items-end">
          <div className="content-container pb-10 md:pb-14 w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <DateLabel
                date={post.date}
                theme="dark"
                className="bg-overlay-white-10 backdrop-blur-sm rounded-pill px-3 py-1 border border-border-dark text-body-light tracking-normal normal-case"
              />
              <LocationTag location={post.location} theme="dark" variant="badge" />
            </div>
            <h1 className="text-heading-light font-display font-bold text-[36px] md:text-[48px] leading-tight mt-4 max-w-3xl [word-break:keep-all]">
              {post.title}
            </h1>
            {post.description && (
              <p className="text-body-light font-body text-lg mt-4 max-w-2xl [word-break:keep-all]">
                {post.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** 변형 A — 라이트 (coverImage 없음, 폴백) */
function DetailHeroLight({ post }: Props) {
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

      <section className="bg-surface-light py-14">
        <div className="content-container">
          <div className="flex items-center gap-2 flex-wrap">
            <DateLabel
              date={post.date}
              className="bg-surface-white rounded-pill px-3 py-1 border border-border-light text-secondary-dark tracking-normal"
            />
            <LocationTag location={post.location} variant="badge" />
          </div>

          <h1 className="text-heading-dark font-display font-bold text-[36px] md:text-[48px] leading-tight mt-4 max-w-3xl [word-break:keep-all]">
            {post.title}
          </h1>

          {post.description && (
            <p className="text-body-dark font-body text-lg mt-4 max-w-2xl [word-break:keep-all]">
              {post.description}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
