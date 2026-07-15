/**
 * 뉴스 캐시 태그 — 순수 문자열 상수/팩토리(서버·클라 무관, 런타임 번들 안전).
 * 서버 페처('use cache' 래퍼)와 'use server' 무효화(revalidateNews)가 공유한다.
 */

/** 뉴스 목록 캐시 태그. 뉴스 create/update/delete 뮤테이션 후 updateTag로 무효화한다. */
export const NEWS_CACHE_TAG = 'news';

/** 뉴스 상세 캐시 태그 팩토리. `news-${id}` 단위로 상세 캐시를 무효화한다. */
export const newsPostCacheTag = (id: string) => `news-${id}`;
