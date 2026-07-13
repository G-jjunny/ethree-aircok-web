import { cacheLife, cacheTag } from 'next/cache';
import { PageHero } from '@/shared/ui';
import { SITE } from '@/shared/config';
import { getNewsList, NEWS_CACHE_TAG, type NewsListResponse } from '@/entities/news';
import { NewsBoard } from './NewsBoard';
import { NewsEmptySection } from './NewsEmptySection';

/**
 * 뉴스 목록 조회를 'use cache'로 캐싱(cacheTag: 'news', cacheLife: short).
 * 검색·타입 필터·페이지네이션은 클라이언트(NewsBoard)에서 로컬 처리하므로
 * 서버에서는 넉넉한 상한(60건)으로 한 번에 조회해 props로 전달한다.
 */
async function getCachedNewsList(): Promise<NewsListResponse> {
  'use cache';
  cacheLife('short');
  cacheTag(NEWS_CACHE_TAG);
  return getNewsList(1, 60);
}

export async function NewsView() {
  let newsData;
  try {
    newsData = await getCachedNewsList();
  } catch {
    newsData = { data: [], total: 0, page: 1, limit: 60 };
  }

  const items = newsData.data;

  return (
    <>
      <PageHero
        label={SITE.pages.news.hero.label}
        title={SITE.pages.news.title}
        body={SITE.pages.news.description}
      />
      {items.length === 0 ? (
        <main className="min-h-screen bg-surface-white">
          <NewsEmptySection />
        </main>
      ) : (
        <NewsBoard items={items} />
      )}
    </>
  );
}
