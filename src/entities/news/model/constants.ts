/**
 * 공개 뉴스 목록 페이지당 항목 수 (단일 출처).
 * 클라이언트 목록 뷰(NewsBoard)와 서버 SSR prefetch(NewsBoardPrefetch)가
 * 동일한 limit을 써야 TanStack Query의 queryKey가 일치해 하이드레이션 mismatch가 없다.
 */
export const NEWS_PAGE_SIZE = 9;
