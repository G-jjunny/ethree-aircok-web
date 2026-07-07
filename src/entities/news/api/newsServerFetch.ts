import { cache } from 'react';
import axios from 'axios';
import { ApiError } from '@/shared/api';
import type { NewsPost, NewsListResponse } from '../model/types';

export class NewsApiError extends ApiError {}

/** 뉴스 목록 캐시 태그. 뉴스 create/update/delete 뮤테이션 후 updateTag로 무효화한다. */
export const NEWS_CACHE_TAG = 'news';
/** 뉴스 상세 캐시 태그 팩토리. `news-${id}` 단위로 상세 캐시를 무효화한다. */
export const newsPostCacheTag = (id: string) => `news-${id}`;

function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.API_URL ?? 'http://localhost:3001/api';
  }
  return '/api';
}

/**
 * 뉴스 목록을 가져온다(서버 컴포넌트 안전, raw fetch).
 * 목록 페이지(NewsView)는 캐시 기반 프리렌더 후보이므로, 백엔드 실패 시 throw 대신
 * 빈 목록을 반환해 빌드 프리렌더를 안전하게 만든다.
 * 요청 간 캐시/무효화는 소비 뷰(NewsView)의 'use cache' 래퍼가 cacheTag('news')로 수행한다.
 */
export async function getNewsList(
  page: number = 1,
  limit: number = 10,
): Promise<NewsListResponse> {
  try {
    const { data } = await axios.get<NewsListResponse>(
      `${getApiBaseUrl()}/news`,
      { params: { page, limit }, timeout: 10000 },
    );
    return data;
  } catch {
    // 백엔드 미가용/네트워크 오류 시 빈 목록 폴백 — 빌드 프리렌더 안전.
    return { data: [], total: 0, page, limit };
  }
}

/**
 * 뉴스 상세를 가져온다(서버 컴포넌트 안전, raw fetch + React cache 요청 스코프 dedupe).
 * generateMetadata + NewsDetailView가 한 요청 내에서 같은 id를 조회할 때 중복 fetch를 막는다.
 * 상세 라우트(/news/[id])는 params로 동적이라 빌드 프리렌더 대상이 아니므로 404 등 실패
 * 신호를 위해 throw를 유지한다(호출부가 try/catch 또는 error boundary로 처리).
 * 요청 간(cross-request) 캐시/무효화는 소비 뷰(NewsDetailView)의 'use cache' 래퍼가
 * cacheTag('news', `news-${id}`)로 수행한다.
 */
export const getNewsPost = cache(async (id: string): Promise<NewsPost> => {
  try {
    const { data } = await axios.get<NewsPost>(
      `${getApiBaseUrl()}/news/${id}`,
      { timeout: 10000 },
    );
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new NewsApiError(
        err.response?.status ?? 0,
        '뉴스 상세를 불러오는 데 실패했습니다.',
      );
    }
    throw new NewsApiError(0, '네트워크 오류');
  }
});
