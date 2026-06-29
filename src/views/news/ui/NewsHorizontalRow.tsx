import Link from 'next/link';
import { DateLabel, LocationTag, NewsImage } from '@/shared/ui';
import type { NewsSummary } from '@/entities/news';

interface Props {
  item: NewsSummary;
  theme?: 'light' | 'dark';
}

/**
 * 매거진형 가로 리스트 row. 좌측 썸네일 + 우측 텍스트 2단.
 * 라이트/다크 변형. design.md §4 "News Horizontal Row".
 * LINK 타입은 외부 URL로 새 탭 열기, BLOG 타입은 내부 라우트.
 */
export function NewsHorizontalRow({ item, theme = 'light' }: Props) {
  const isDark = theme === 'dark';

  const content = (
    <article className="group flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
      {/* 썸네일 (고정 너비) — token 없음: row 썸네일 고정 너비 280px, 매거진 가로형 전용 1회성 수치 */}
      <div className="w-full sm:w-[280px] shrink-0 rounded-lg overflow-hidden">
        <NewsImage
          src={item.coverImage}
          alt={item.title}
          ratio="row-thumb"
          theme={theme}
          className="group-hover:scale-[1.02] transition-transform duration-200"
        />
      </div>
      {/* 텍스트 */}
      <div className="flex flex-col gap-2 min-w-0 flex-1">
        <DateLabel date={item.date} theme={theme} />
        <h3
          className={`font-display font-semibold text-[21px] leading-snug [word-break:keep-all] ${
            isDark ? 'text-heading-light' : 'text-heading-dark'
          }`}
        >
          {item.title}
        </h3>
        <p
          className={`text-sm font-body line-clamp-2 [word-break:keep-all] ${
            isDark ? 'text-body-light' : 'text-body-dark'
          }`}
        >
          {item.description}
        </p>
        {item.location && (
          <LocationTag location={item.location} theme={theme} className="mt-1" />
        )}
      </div>
    </article>
  );

  if (item.type === 'LINK' && item.externalUrl) {
    return (
      <a
        href={item.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={`/news/${item.id}`} className="block">
      {content}
    </Link>
  );
}
