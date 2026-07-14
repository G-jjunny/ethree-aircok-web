import { Suspense } from 'react';
import { PageHero } from '@/shared/ui';
import { SITE } from '@/shared/config';
import { NewsBoard } from './NewsBoard';

/**
 * 뉴스 목록 페이지 셸.
 * PageHero는 정적 셸로 프리렌더되고, URL 쿼리스트링(useSearchParams)을 읽어
 * 서버 페이지네이션·검색·타입 필터를 수행하는 NewsBoard는 <Suspense> 경계로 감싼다.
 * (Next.js 16 cacheComponents/PPR — useSearchParams는 Suspense 경계가 필요)
 */
export function NewsView() {
  return (
    <>
      <PageHero
        label={SITE.pages.news.hero.label}
        title={SITE.pages.news.title}
        body={SITE.pages.news.description}
      />
      <Suspense
        fallback={<main className="min-h-screen bg-surface-white py-14 md:py-20" />}
      >
        <NewsBoard />
      </Suspense>
    </>
  );
}
