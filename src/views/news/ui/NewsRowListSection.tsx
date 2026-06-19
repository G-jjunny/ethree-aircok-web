import { NewsHorizontalRow } from './NewsHorizontalRow';
import type { NewsSummary } from '@/entities/news';

interface Props {
  items: NewsSummary[];
}

/**
 * 주요 기사 row 섹션 (라이트 화이트). News Horizontal Row 라이트 변형을 세로 나열.
 * 각 row는 divide-y 구분선 + 상하 패딩.
 */
export function NewsRowListSection({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="bg-surface-white py-16">
      <div className="content-container flex flex-col divide-y divide-border-light">
        {items.map((item) => (
          <div key={item.id} className="py-8 first:pt-0 last:pb-0">
            <NewsHorizontalRow item={item} theme="light" />
          </div>
        ))}
      </div>
    </section>
  );
}
