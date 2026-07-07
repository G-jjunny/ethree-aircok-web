import { cache } from 'react';
import axios from 'axios';
import { ApiError } from '@/shared/api';
import type { NewsPost, NewsListResponse } from '../model/types';

export class NewsApiError extends ApiError {}

function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.API_URL ?? 'http://localhost:3001/api';
  }
  return '/api';
}

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
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new NewsApiError(
        err.response?.status ?? 0,
        '뉴스 목록을 불러오는 데 실패했습니다.',
      );
    }
    throw new NewsApiError(0, '네트워크 오류');
  }
}

// getNewsPost is axios-based, so it is NOT auto-memoized like Next fetch.
// Wrap with React cache() so generateMetadata + NewsDetailView dedupe within one request.
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
