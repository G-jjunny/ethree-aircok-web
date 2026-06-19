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
}

export interface NewsListResponse {
  data: NewsSummary[];
  total: number;
  page: number;
  limit: number;
}

export interface NewsPost extends NewsSummary {
  content: string; // HTML 문자열
}
