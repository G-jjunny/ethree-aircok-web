import Link from 'next/link';
import { DateLabel, LocationTag, NewsImage } from '@/shared/ui';
import type { NewsSummary } from '@/entities/news';

interface Props {
  item: NewsSummary;
}

/**
 * 매거진 목록 최상단 Featured 섹션.
 * 대표 기사 1건(News Featured Hero)을 렌더한다.
 * 페이지 헤더는 PageHero(shared/ui)로 분리됨.
 * coverImage 있으면 Overlay 변형, 없으면 텍스트 분리형 폴백.
 * LINK 타입은 외부 URL로 새 탭 열기, BLOG 타입은 내부 라우트.
 */
export function NewsFeaturedSection({ item }: Props) {
  return (
    <section className="bg-surface-light py-16 md:py-20">
      <div className="content-container flex flex-col gap-8">
        {item.coverImage ? (
          <FeaturedOverlay item={item} />
        ) : (
          <FeaturedSplit item={item} />
        )}
      </div>
    </section>
  );
}

/** 공통 래퍼: LINK면 외부 a, BLOG면 내부 Link */
function NewsItemWrapper({
  item,
  className,
  children,
}: {
  item: NewsSummary;
  className?: string;
  children: React.ReactNode;
}) {
  if (item.type === 'LINK' && item.externalUrl) {
    return (
      <a
        href={item.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={`/news/${item.id}`} className={className}>
      {children}
    </Link>
  );
}

/** Overlay 변형 — 커버 이미지 위 텍스트 오버레이 */
function FeaturedOverlay({ item }: Props) {
  return (
    <NewsItemWrapper item={item} className="block">
      <article className="relative rounded-xl overflow-hidden group">
        <NewsImage
          src={item.coverImage}
          alt={item.title}
          ratio="featured"
          priority
          className="group-hover:scale-[1.02] transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-overlay-dark-60" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 gap-3">
          <DateLabel date={item.date} theme="dark" emphasis />
          <h2 className="text-heading-light font-display font-bold text-[28px] md:text-[40px] leading-[1.10] tracking-[-0.3px] max-w-3xl [word-break:keep-all]">
            {item.title}
          </h2>
          <p className="text-body-light font-body text-base md:text-lg line-clamp-2 max-w-2xl [word-break:keep-all]">
            {item.description}
          </p>
          {item.location && (
            <LocationTag
              location={item.location}
              theme="dark"
              className="opacity-80"
            />
          )}
        </div>
      </article>
    </NewsItemWrapper>
  );
}

/** 텍스트 분리형 — coverImage 없을 때 폴백 (좌우 split, 이미지 칼럼은 placeholder) */
function FeaturedSplit({ item }: Props) {
  return (
    <NewsItemWrapper item={item} className="block group">
      <article className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="rounded-xl overflow-hidden">
          <NewsImage src={item.coverImage} alt={item.title} ratio="video" />
        </div>
        <div className="flex flex-col gap-4">
          <DateLabel date={item.date} emphasis />
          <h2 className="text-heading-dark font-display font-bold text-[32px] md:text-[40px] leading-[1.10] tracking-[-0.3px] [word-break:keep-all]">
            {item.title}
          </h2>
          <p className="text-body-dark font-body text-lg line-clamp-3 [word-break:keep-all]">
            {item.description}
          </p>
          {item.location && <LocationTag location={item.location} />}
          <span className="text-aircok-blue text-sm font-body mt-2 inline-block">
            자세히 보기 →
          </span>
        </div>
      </article>
    </NewsItemWrapper>
  );
}
