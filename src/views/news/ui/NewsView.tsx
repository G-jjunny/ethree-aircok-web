import { cacheLife, cacheTag } from 'next/cache';
import { PageHero } from '@/shared/ui';
import { SITE } from '@/shared/config';
import { getNewsList, NEWS_CACHE_TAG, type NewsListResponse } from '@/entities/news';
import { NewsMagazine } from './NewsMagazine';
import { NewsEmptySection } from './NewsEmptySection';

/** 뉴스 목록 조회를 'use cache'로 캐싱(cacheTag: 'news', cacheLife: short). */
async function getCachedNewsList(): Promise<NewsListResponse> {
  'use cache';
  cacheLife('short');
  cacheTag(NEWS_CACHE_TAG);
  return getNewsList(1, 30);
}

export async function NewsView() {
  let newsData;
  try {
    newsData = await getCachedNewsList();
  } catch {
    newsData = { data: [], total: 0, page: 1, limit: 30 };
  }

  const items = newsData.data;

  if (items.length === 0) {
    return (
      <>
        <PageHero
          label={SITE.pages.news.hero.label}
          title={SITE.pages.news.title}
          body={SITE.pages.news.description}
        />
        <main className="min-h-screen bg-surface-white">
          <NewsEmptySection />
        </main>
      </>
    );
  }

  // 연도 필터·매거진 분배는 클라이언트 인터랙션이므로 NewsMagazine으로 위임
  return (
    <>
      <PageHero
        label={SITE.pages.news.hero.label}
        title={SITE.pages.news.title}
        body={SITE.pages.news.description}
      />
      <NewsMagazine items={items} />
    </>
  );
}
