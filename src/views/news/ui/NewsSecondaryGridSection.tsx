import { NewsHorizontalRow } from './NewsHorizontalRow';
import type { NewsSummary } from '@/entities/news';

interface Props {
  items: NewsSummary[];
}

/**
 * 보조 그리드 섹션 (다크). News Horizontal Row 다크 변형을 2열 배치.
 * 라이트↔다크 교차 리듬을 완성한다.
 */
export function NewsSecondaryGridSection({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="bg-surface-dark py-16 md:py-20">
      <div className="content-container grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
        {items.map((item) => (
          <NewsHorizontalRow key={item.id} item={item} theme="dark" />
        ))}
      </div>
    </section>
  );
}
