'use client';

import { useCallback, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export interface AdminTabItem {
  key: string;
  label: string;
}

export interface AdminTabsProps {
  /** 렌더할 탭 목록. `key`는 URL `?tab=` 값, `label`은 탭 라벨. */
  tabs: AdminTabItem[];
  /** 활성 탭 판별 실패 시 사용할 기본 탭 key. 미지정 시 `tabs[0].key`. */
  defaultTabKey?: string;
  /** tablist의 `aria-label`(접근성). 미지정 시 기본값. */
  label?: string;
}

/**
 * URL searchParams `?tab=<key>` 기반으로 현재 활성 탭 key를 반환한다.
 * - 유효하지 않거나 없으면 `defaultTabKey`(미지정 시 `tabs[0].key`)를 반환한다.
 * - 소비 페이지가 활성 탭에 따라 패널을 조건부 렌더할 수 있게 한다.
 *
 * useSearchParams를 사용하므로 이 훅을 쓰는 컴포넌트는 소비 측에서 <Suspense>로 감싸야 한다.
 */
export function useAdminActiveTab(
  tabs: AdminTabItem[],
  defaultTabKey?: string,
): string {
  const searchParams = useSearchParams();
  const fallback = defaultTabKey ?? tabs[0]?.key;
  const rawTab = searchParams.get('tab');
  const isValid = rawTab !== null && tabs.some((t) => t.key === rawTab);
  return isValid ? rawTab : fallback;
}

/**
 * 관리자 콘솔 공용 탭바.
 * - 활성 탭은 URL searchParams `?tab=<key>` 기반(기타 searchParams 보존).
 * - 좌우 화살표 + Home/End 키보드 네비(순환, focus 이동).
 * - 접근성: role="tablist"/"tab", aria-selected/controls, roving tabIndex.
 *
 * 도메인 무관(shared) — 탭 정의(SITE 등)는 props로만 주입한다.
 */
export function AdminTabs({ tabs, defaultTabKey, label }: AdminTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const activeTab = useAdminActiveTab(tabs, defaultTabKey);

  const setActiveTab = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', key);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex: number | null = null;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = tabs.length - 1;
    }
    if (nextIndex !== null) {
      e.preventDefault();
      const nextKey = tabs[nextIndex].key;
      setActiveTab(nextKey);
      tabRefs.current[nextKey]?.focus();
    }
  };

  return (
    <div className="bg-surface-white px-6 lg:px-8">
      <div
        role="tablist"
        aria-label={label ?? '관리자 탭'}
        className="flex items-center gap-1 border-b border-hairline overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {tabs.map((tab, index) => {
          const active = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              ref={(el) => {
                tabRefs.current[tab.key] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${tab.key}`}
              aria-selected={active}
              aria-controls={`panel-${tab.key}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setActiveTab(tab.key)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={
                active
                  ? 'shrink-0 -mb-px border-b-2 border-brand px-4 py-3 min-h-11 text-sm font-body font-semibold text-brand transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-t-md'
                  : 'shrink-0 -mb-px border-b-2 border-transparent px-4 py-3 min-h-11 text-sm font-body text-muted hover:text-ink transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-t-md'
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
