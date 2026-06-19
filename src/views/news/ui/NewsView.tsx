import Link from 'next/link';
import { SITE } from '@/shared/config';
import { getNewsList } from '@/entities/news';
import type { NewsSummary } from '@/entities/news';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

function formatDate(dateStr: string): string {
  return dateStr.slice(0, 10).replace(/-/g, '.');
}

function NewsCard({ item }: { item: NewsSummary }) {
  return (
    <Link href={`/news/${item.id}`} className="block group">
      <article className="bg-surface-white rounded-xl shadow-card overflow-hidden hover:shadow-product hover:-translate-y-1 transition-all duration-200">
        {item.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={
              item.coverImage.startsWith('http')
                ? item.coverImage
                : `${API_BASE}${item.coverImage}`
            }
            alt={item.title}
            className="aspect-video w-full object-cover"
          />
        ) : (
          <div className="aspect-video bg-surface-light flex items-center justify-center">
            <svg
              className="w-6 h-6 text-secondary-dark"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
              />
            </svg>
          </div>
        )}
        <div className="p-6">
          <time className="text-aircok-blue text-xs font-body tracking-wide">
            {formatDate(item.date)}
          </time>
          <h2 className="text-heading-dark font-display font-semibold text-[18px] leading-snug mt-2">
            {item.title}
          </h2>
          <p className="text-body-dark text-sm font-body line-clamp-2 mt-2">
            {item.description}
          </p>
          {item.location && (
            <p className="text-secondary-dark text-xs mt-3">
              📍 {item.location}
            </p>
          )}
          <span className="text-aircok-blue text-sm font-body mt-4 inline-block">
            자세히 보기 →
          </span>
        </div>
      </article>
    </Link>
  );
}

export async function NewsView() {
  let newsData;
  try {
    newsData = await getNewsList(1, 30);
  } catch {
    newsData = { data: [], total: 0, page: 1, limit: 30 };
  }

  return (
    <main className="min-h-screen bg-surface-white">
      {/* Hero 섹션 */}
      <section className="bg-surface-light py-16 md:py-24">
        <div className="content-container">
          <p className="text-aircok-blue text-sm font-body tracking-widest uppercase">
            NEWS
          </p>
          <h1 className="text-[40px] font-display font-semibold text-heading-dark mt-3 [word-break:keep-all]">
            {SITE.pages.news.title}
          </h1>
          <p className="text-body-dark font-body mt-4 [word-break:keep-all]">
            스마트 에어콕의 최신 소식을 전해드립니다
          </p>
        </div>
      </section>

      {/* 카드 그리드 섹션 */}
      <section className="bg-surface-white py-16">
        <div className="content-container">
          {newsData.data.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-secondary-dark font-body text-[17px]">
                등록된 뉴스가 없습니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsData.data.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
