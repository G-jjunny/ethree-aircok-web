'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  adminNewsQueryOptions,
  AdminNewsApiError,
} from '@/entities/news';
import { AdminPageHeader, Button } from '@/shared/ui';
import { NewsFilterSection } from './NewsFilterSection';
import { NewsTableSection } from './NewsTableSection';

export function AdminNewsListView() {
  const [search, setSearch] = useState('');
  const [publishedFilter, setPublishedFilter] = useState<'all' | 'published' | 'unpublished'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'BLOG' | 'LINK'>('all');

  const { data, error, isPending, isError, refetch, isRefetching } = useQuery(
    adminNewsQueryOptions(1, 100),
  );

  const isAuthError = error instanceof AdminNewsApiError && error.isAuthError;

  const filtered = useMemo(() => {
    let items = data?.data ?? [];
    if (search) {
      items = items.filter((i) =>
        i.title.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (publishedFilter !== 'all') {
      items = items.filter((i) =>
        publishedFilter === 'published' ? i.published : !i.published,
      );
    }
    if (typeFilter !== 'all') {
      items = items.filter((i) => i.type === typeFilter);
    }
    return items;
  }, [data, search, publishedFilter, typeFilter]);

  return (
    <div>
      <AdminPageHeader title="뉴스 관리" description="뉴스 페이지의 뉴스 기사를 작성·수정·삭제합니다.">
        <Link
          href="/console/news/new"
          className="inline-flex items-center justify-center bg-aircok-blue text-heading-light text-sm font-medium rounded-md px-4 py-2 min-h-[44px] hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2"
        >
          새 뉴스 작성
        </Link>
      </AdminPageHeader>

      {/* 콘텐츠 영역 */}
      <div className="p-6 lg:p-8">
        {isPending ? (
          <div className="flex flex-col items-center justify-center text-center gap-4 rounded-xl border border-border-light bg-surface-white px-6 py-16">
            <p className="text-secondary-dark font-body text-[15px] leading-[1.43] [word-break:keep-all]">
              불러오는 중...
            </p>
          </div>
        ) : isError && isAuthError ? (
          <div className="flex flex-col items-center justify-center text-center gap-4 rounded-xl border border-border-light bg-surface-white px-6 py-16">
            <p className="text-error font-body text-[15px] leading-[1.43] [word-break:keep-all]">
              로그인이 필요합니다.
            </p>
            <Link
              href="/console/login"
              className="inline-flex items-center justify-center bg-aircok-blue text-heading-light text-sm font-medium rounded-md px-4 py-2 min-h-[44px] hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2"
            >
              로그인 페이지로 이동
            </Link>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center text-center gap-4 rounded-xl border border-border-light bg-surface-white px-6 py-16">
            <p className="text-error font-body text-[15px] leading-[1.43] [word-break:keep-all]">
              뉴스 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
            </p>
            {/* min-h-11(44px) 은 Button size="sm" 에 없는 터치 타겟 보정 — 기존 min-h-[44px] 승계 */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="min-h-11"
            >
              {isRefetching ? '다시 시도 중...' : '다시 시도'}
            </Button>
          </div>
        ) : (
          <>
            <NewsFilterSection
              search={search}
              onSearchChange={setSearch}
              publishedFilter={publishedFilter}
              onPublishedFilterChange={setPublishedFilter}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
            />
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center gap-4 rounded-xl border border-border-light bg-surface-white px-6 py-16">
                <p className="text-body-dark font-body text-[15px] leading-[1.43] [word-break:keep-all]">
                  {data?.data.length === 0
                    ? '등록된 뉴스가 없습니다.'
                    : '검색 결과가 없습니다.'}
                </p>
                {data?.data.length === 0 && (
                  <Link
                    href="/console/news/new"
                    className="inline-flex items-center justify-center bg-aircok-blue text-heading-light text-sm font-medium rounded-md px-4 py-2 min-h-[44px] hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2"
                  >
                    새 뉴스 작성
                  </Link>
                )}
              </div>
            ) : (
              <NewsTableSection items={filtered} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
