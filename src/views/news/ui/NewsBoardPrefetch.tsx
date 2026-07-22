import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getNewsList } from '@/entities/news/server';
import { newsKeys, NEWS_PAGE_SIZE, type NewsType } from '@/entities/news';
import { NewsBoard } from './NewsBoard';

type SearchParams = { [key: string]: string | string[] | undefined };

/** searchParams 값이 배열/undefined일 수 있으므로 문자열 하나만 안전 추출한다. */
function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * 현재 URL(searchParams)에 해당하는 뉴스 목록 페이지를 서버에서 prefetch해
 * 초기 HTML에 콘텐츠를 채우고, 이후 상호작용은 NewsBoard(클라이언트)가 이어받는다.
 *
 * queryKey 일치가 핵심 — NewsBoard의 useQuery와 정확히 동일한 파싱 규칙으로
 * page/type/q를 도출하고, 동일한 NEWS_PAGE_SIZE(limit)와 newsKeys.list를 사용한다.
 * queryFn만 서버 안전 페처(getNewsList)로 지정한다(axiosInstance는 클라이언트 전용).
 */
export async function NewsBoardPrefetch({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;

  // NewsBoard와 동일 규칙 파싱 ------------------------------------------------
  // page: Number 변환 후 양의 정수만 인정, 그 외 1.
  const pageRaw = Number(firstValue(sp.page));
  const page = Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  // type: 소문자 URL 값 → 대문자 NewsType. 그 외(ALL) undefined.
  const typeRaw = firstValue(sp.type);
  const type: NewsType | undefined =
    typeRaw === 'link' ? 'LINK' : typeRaw === 'blog' ? 'BLOG' : undefined;

  // search: NewsBoard는 URL 원문 q(없으면 '')를 그대로 넘긴다.
  // newsKeys.list가 양쪽에서 동일하게 trim||undefined로 정규화하므로 키가 일치한다.
  const search = firstValue(sp.q) ?? '';

  const limit = NEWS_PAGE_SIZE;

  // 요청마다 새 QueryClient — 전역 QueryProvider의 클라이언트와 별개인 prefetch 전용.
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: newsKeys.list({ page, limit, search, type }),
    queryFn: () => getNewsList(page, limit, search, type),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NewsBoard />
    </HydrationBoundary>
  );
}
