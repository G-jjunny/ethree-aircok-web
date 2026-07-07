export { NewsView } from './ui/NewsView';
export { NewsDetailView } from './ui/NewsDetailView';
// app 셸(next-app)이 entities를 직접 import하지 못하도록(FSD boundaries),
// 뉴스 서버 페처를 views 슬라이스 public API로 재노출한다.
export { getNewsList, getNewsPost } from '@/entities/news';
