import type { NewsType } from '../model/types';

/** 공개 뉴스 목록 조회 파라미터. 백엔드 계약(GET /api/news)과 1:1 매핑된다. */
export interface NewsListParams {
  page: number;
  limit: number;
  /** title/description 부분일치. trim 후 빈 문자열이면 요청에서 제외한다. */
  search?: string;
  /** 'BLOG' | 'LINK' 대문자만. 미지정=전체. */
  type?: NewsType;
}

export const newsKeys = {
  all: ['news'] as const,
  list: (params: NewsListParams) => {
    const search = params.search?.trim() || undefined;
    return [
      ...newsKeys.all,
      {
        page: params.page,
        limit: params.limit,
        search,
        type: params.type,
      },
    ] as const;
  },
  detail: (id: string) => [...newsKeys.all, id] as const,
};
