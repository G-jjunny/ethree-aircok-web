import { getNewsList } from '@/entities/news';
import { NewsMagazine } from './NewsMagazine';
import { NewsEmptySection } from './NewsEmptySection';

export async function NewsView() {
  let newsData;
  try {
    newsData = await getNewsList(1, 30);
  } catch {
    newsData = { data: [], total: 0, page: 1, limit: 30 };
  }

  const items = newsData.data;

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-surface-white">
        <NewsEmptySection />
      </main>
    );
  }

  // 연도 필터·매거진 분배는 클라이언트 인터랙션이므로 NewsMagazine으로 위임
  return <NewsMagazine items={items} />;
}
