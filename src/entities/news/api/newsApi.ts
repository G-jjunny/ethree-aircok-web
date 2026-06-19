import type { NewsListResponse, NewsPost } from '../model/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function getNewsList(
  page: number = 1,
  limit: number = 10,
): Promise<NewsListResponse> {
  const res = await fetch(
    `${API_BASE}/api/news?page=${page}&limit=${limit}`,
    { cache: 'no-store' },
  );
  if (!res.ok) throw new Error('뉴스 목록을 불러오는 데 실패했습니다.');
  return res.json() as Promise<NewsListResponse>;
}

export async function getAdminNewsList(
  page: number = 1,
  limit: number = 100,
): Promise<NewsListResponse> {
  const res = await fetch(
    `${API_BASE}/api/news/admin?page=${page}&limit=${limit}`,
    { cache: 'no-store', credentials: 'include' },
  );
  if (!res.ok) throw new Error('어드민 뉴스 목록을 불러오는 데 실패했습니다.');
  return res.json() as Promise<NewsListResponse>;
}

export async function getNewsPost(id: string): Promise<NewsPost> {
  const res = await fetch(`${API_BASE}/api/news/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('뉴스 상세를 불러오는 데 실패했습니다.');
  return res.json() as Promise<NewsPost>;
}
