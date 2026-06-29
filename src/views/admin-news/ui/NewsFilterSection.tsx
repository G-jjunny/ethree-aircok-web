'use client';

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  publishedFilter: 'all' | 'published' | 'unpublished';
  onPublishedFilterChange: (v: 'all' | 'published' | 'unpublished') => void;
  typeFilter: 'all' | 'BLOG' | 'LINK';
  onTypeFilterChange: (v: 'all' | 'BLOG' | 'LINK') => void;
}

export function NewsFilterSection({
  search,
  onSearchChange,
  publishedFilter,
  onPublishedFilterChange,
  typeFilter,
  onTypeFilterChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3 items-center mb-4">
      {/* 검색 */}
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="제목으로 검색..."
        className="border border-border-light rounded-md px-3 py-2 text-body-dark text-sm font-body focus:outline-none focus:ring-2 focus:ring-aircok-blue w-56"
      />

      {/* 발행상태 필터 */}
      <select
        value={publishedFilter}
        onChange={(e) =>
          onPublishedFilterChange(e.target.value as 'all' | 'published' | 'unpublished')
        }
        className="border border-border-light rounded-md px-3 py-2 text-body-dark text-sm font-body focus:outline-none focus:ring-2 focus:ring-aircok-blue bg-surface-white"
      >
        <option value="all">전체 상태</option>
        <option value="published">발행됨</option>
        <option value="unpublished">미발행</option>
      </select>

      {/* 타입 필터 */}
      <select
        value={typeFilter}
        onChange={(e) =>
          onTypeFilterChange(e.target.value as 'all' | 'BLOG' | 'LINK')
        }
        className="border border-border-light rounded-md px-3 py-2 text-body-dark text-sm font-body focus:outline-none focus:ring-2 focus:ring-aircok-blue bg-surface-white"
      >
        <option value="all">전체 타입</option>
        <option value="BLOG">블로그형</option>
        <option value="LINK">링크형</option>
      </select>
    </div>
  );
}
