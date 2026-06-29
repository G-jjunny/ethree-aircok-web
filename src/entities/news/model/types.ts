export type NewsType = 'BLOG' | 'LINK';

export interface NewsSummary {
  id: string;
  title: string;
  description: string;
  date: string; // ISO 날짜 문자열
  location: string | null;
  published: boolean;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
  type: NewsType;
  externalUrl: string | null;
}

export interface NewsListResponse {
  data: NewsSummary[];
  total: number;
  page: number;
  limit: number;
}

export interface NewsPost extends NewsSummary {
  content: string | null; // HTML 문자열 (LINK 타입은 null일 수 있음)
}
