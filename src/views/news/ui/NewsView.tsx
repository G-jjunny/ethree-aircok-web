import { Suspense } from 'react';
import { PageHero } from '@/widgets/page-hero';
import { SITE } from '@/shared/config';
import { NewsBoardPrefetch } from './NewsBoardPrefetch';

type SearchParams = { [key: string]: string | string[] | undefined };

/**
 * 뉴스 목록 페이지 셸.
 * PageHero는 searchParams를 소비하지 않는 최상위에서 렌더되어 정적 셸로 프리렌더된다.
 * searchParams(await)를 소비하는 SSR prefetch(NewsBoardPrefetch)만 <Suspense> 경계
 * 하위 async 컴포넌트로 분리해, 전체 페이지가 dynamic이 되지 않게 한다.
 * NewsBoardPrefetch는 서버에서 현재 URL 페이지를 prefetch 후 HydrationBoundary로 감싼
 * NewsBoard('use client' + useSearchParams)를 렌더한다.
 * (Next.js 16 cacheComponents/PPR — searchParams await·useSearchParams는 Suspense 경계 필요)
 */
export function NewsView({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <>
      <PageHero
        eyebrow={SITE.pages.news.hero.label}
        headline={{ prefix: SITE.pages.news.title }}
        body={SITE.pages.news.description}
      />
      <Suspense
        fallback={<main className="min-h-screen bg-surface-white py-14 md:py-20" />}
      >
        <NewsBoardPrefetch searchParams={searchParams} />
      </Suspense>
    </>
  );
}
