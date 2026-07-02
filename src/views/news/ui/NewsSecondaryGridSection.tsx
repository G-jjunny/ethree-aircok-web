import { NewsHorizontalRow } from './NewsHorizontalRow';
import type { NewsSummary } from '@/entities/news';

interface Props {
  items: NewsSummary[];
}

/**
 * 보조 그리드 섹션 (라이트 톤 전환). News Horizontal Row 라이트 변형을 2열 배치.
 * bg-surface-light와 위 섹션(bg-surface-white)의 미세한 명도차만으로 섹션 경계를 구분한다.
 * design.md §4 "News Magazine Layout" 배경 결정 참조.
 */
export function NewsSecondaryGridSection({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="bg-surface-light py-16 md:py-20">
      <div className="content-container grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
        {items.map((item) => (
          <NewsHorizontalRow key={item.id} item={item} theme="light" />
        ))}
      </div>
    </section>
  );
}
