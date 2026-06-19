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
    <Link href={`/news/${item.id}`} className="block">
      <article className="bg-surface-white rounded-xl shadow-card overflow-hidden hover:shadow-product transition-shadow duration-200">
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
            <span className="text-secondary-dark text-sm font-body">이미지 없음</span>
          </div>
        )}
        <div className="p-5">
          <time className="text-secondary-dark text-sm font-body">
            {formatDate(item.date)}
          </time>
          <h2 className="text-heading-dark font-display font-semibold text-lg leading-snug mt-1">
            {item.title}
          </h2>
          <p className="text-body-dark text-sm line-clamp-2 font-body mt-2">
            {item.description}
          </p>
          {item.location && (
            <p className="text-secondary-dark text-xs mt-1">{item.location}</p>
          )}
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
      <div className="content-container py-20">
        <h1 className="text-heading-dark font-display text-[40px] font-semibold">
          {SITE.pages.news.title}
        </h1>
        {newsData.data.length === 0 ? (
          <p className="text-body-dark mt-8 font-body">등록된 뉴스가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {newsData.data.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
