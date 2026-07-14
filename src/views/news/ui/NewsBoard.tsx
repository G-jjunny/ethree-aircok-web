'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { NewsType } from '@/entities/news';
import { newsListQueryOptions } from '@/entities/news';
import { useDebouncedValue } from '@/shared/hooks';
import { NewsCard } from './NewsCard';

type FilterValue = 'ALL' | NewsType;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'LINK', label: '뉴스 링크' },
  { value: 'BLOG', label: '게시글' },
];

const PAGE_SIZE = 9;

/** 돋보기 아이콘 */
function SearchIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="m20 20-3.5-3.5" />
    </svg>
  );
}

/** 클리어(×) 아이콘 */
function ClearIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
    >
      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/** 페이지네이션 화살표(‹ / ›) */
function ChevronIcon({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg
      className="h-[18px] w-[18px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={dir === 'left' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'}
      />
    </svg>
  );
}

/** URL의 소문자 type ↔ 내부 API 대문자 NewsType 매핑. */
function toFilterValue(urlType: string | null): FilterValue {
  if (urlType === 'link') return 'LINK';
  if (urlType === 'blog') return 'BLOG';
  return 'ALL';
}

export function NewsBoard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL 쿼리스트링이 단일 진실원천 — 상태를 URL에서 도출한다.
  const filter = toFilterValue(searchParams.get('type'));
  const apiType: NewsType | undefined = filter === 'ALL' ? undefined : filter;
  const q = searchParams.get('q') ?? '';
  const pageParam = Number(searchParams.get('page'));
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  // 검색 인풋은 즉시 반영되는 로컬 제어 상태, URL q 반영만 디바운스한다.
  const [inputValue, setInputValue] = useState(q);
  const debouncedInput = useDebouncedValue(inputValue, 300);

  // URL 갱신 헬퍼 — 기존 파라미터를 보존하며 일부만 변경한다.
  const pushParams = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  // 디바운스된 검색어를 URL q에 반영하고 page=1로 리셋한다.
  useEffect(() => {
    if (debouncedInput === q) return;
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedInput.trim()) params.set('q', debouncedInput);
    else params.delete('q');
    params.delete('page'); // 검색 변경 시 첫 페이지로 리셋
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }, [debouncedInput, q, searchParams, pathname, router]);

  const handleFilter = (value: FilterValue) => {
    pushParams((params) => {
      if (value === 'ALL') params.delete('type');
      else params.set('type', value.toLowerCase()); // 'LINK' -> 'link'
      params.delete('page'); // 타입 변경 시 첫 페이지로 리셋
    });
  };

  const goToPage = (target: number) => {
    pushParams((params) => {
      if (target <= 1) params.delete('page');
      else params.set('page', String(target));
    });
  };

  const clearSearch = () => setInputValue('');

  const { data, isPending, isError, isSuccess, isPlaceholderData } = useQuery({
    ...newsListQueryOptions({ page, limit: PAGE_SIZE, search: q, type: apiType }),
    placeholderData: keepPreviousData,
  });

  const pageItems = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = page;
  // 초기 로딩만 로딩 상태로 취급(페이지 전환은 keepPreviousData로 이전 데이터 유지).
  const isInitialLoading = isPending && !isPlaceholderData;

  // 범위 초과 page(수동 URL·오래된 북마크·항목 삭제 후) graceful 처리:
  // 최신 응답 기준으로 마지막 유효 페이지로 클램프한다.
  // 무한 리다이렉트 방지 — 실제 최신 응답일 때만(placeholder/로딩 중 제외) 재조정하고,
  // total>0 && page>totalPages(=진짜 범위 초과)인 경우로 한정한다. 빈 결과(total=0)는 클램프하지 않는다.
  useEffect(() => {
    if (!isSuccess || isPlaceholderData) return;
    if (total > 0 && page > totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      if (totalPages <= 1) params.delete('page');
      else params.set('page', String(totalPages));
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    }
  }, [
    isSuccess,
    isPlaceholderData,
    total,
    page,
    totalPages,
    searchParams,
    pathname,
    router,
  ]);

  return (
    <main className="min-h-screen bg-surface-white py-14 md:py-20">
      <div className="content-container">
        {/* 검색 + 필터 바 */}
        <div className="flex flex-col gap-4 border-b border-hairline pb-6 md:flex-row md:items-center md:justify-between">
          {/* 필터 칩 */}
          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.value;
              return (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => handleFilter(f.value)}
                  aria-pressed={active}
                  className={`rounded-pill px-5 py-2.5 text-sm font-semibold transition-colors duration-fast ease-out ${
                    active
                      ? 'bg-brand text-brand-ink'
                      : 'border border-hairline bg-surface-white text-muted hover:text-ink'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* 검색 인풋 */}
          <div className="relative w-full md:w-80">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="제목·카테고리 검색"
              className="w-full rounded-pill border border-hairline bg-surface-white py-2.5 pl-11 pr-11 text-sm text-ink placeholder:text-faint focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
            {inputValue && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="검색어 지우기"
                className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-surface text-muted transition-colors hover:text-ink"
              >
                <ClearIcon />
              </button>
            )}
          </div>
        </div>

        {/* 카드 그리드 / 빈 상태 */}
        {isError ? (
          <div className="mt-9 rounded-image border border-hairline bg-surface px-6 py-16 text-center">
            <p className="text-lg font-bold text-ink">
              소식을 불러오지 못했습니다
            </p>
            <p className="mt-2 text-sm text-muted">
              잠시 후 다시 시도해 주세요.
            </p>
          </div>
        ) : isInitialLoading ? (
          <div className="mt-9 rounded-image border border-hairline bg-surface px-6 py-16 text-center">
            <p className="text-sm text-muted">소식을 불러오는 중입니다…</p>
          </div>
        ) : pageItems.length === 0 ? (
          <div className="mt-9 rounded-image border border-hairline bg-surface px-6 py-16 text-center">
            <p className="text-lg font-bold text-ink">검색 결과가 없습니다</p>
            <p className="mt-2 text-sm text-muted">
              {q
                ? `'${q}'에 대한 소식을 찾지 못했어요. 다른 검색어를 입력해 보세요.`
                : '조건에 맞는 소식을 찾지 못했어요. 다른 필터를 선택해 보세요.'}
            </p>
          </div>
        ) : (
          <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {!isError && totalPages > 1 && (
          <nav
            className="mt-11 flex items-center justify-center gap-2"
            aria-label="뉴스 목록 페이지"
          >
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              aria-label="이전 페이지"
              className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px] border border-hairline bg-surface-white text-ink transition-colors hover:bg-surface disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronIcon dir="left" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const active = p === currentPage;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => goToPage(p)}
                  aria-current={active ? 'page' : undefined}
                  className={`h-[40px] min-w-[40px] rounded-[10px] px-[10px] text-sm font-bold transition-colors ${
                    active
                      ? 'bg-brand text-brand-ink'
                      : 'border border-hairline bg-surface-white text-ink hover:bg-surface'
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              aria-label="다음 페이지"
              className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px] border border-hairline bg-surface-white text-ink transition-colors hover:bg-surface disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronIcon dir="right" />
            </button>
          </nav>
        )}
      </div>
    </main>
  );
}
