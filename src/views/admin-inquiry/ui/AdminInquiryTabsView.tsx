'use client';

import { useCallback, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { AdminInquiryListView } from '@/widgets/admin-inquiry-list';
import { AdminMailSettingView } from '@/widgets/admin-mail-setting';
import { AdminMapSettingView } from '@/widgets/admin-map-setting';
import { SITE } from '@/shared/config/site';

type TabKey = (typeof SITE.admin.inquiryTabs)[number]['key'];

const TABS = SITE.admin.inquiryTabs;
const TAB_KEYS = TABS.map((t) => t.key);
const DEFAULT_TAB: TabKey = TABS[0].key;

function isTabKey(value: string | null): value is TabKey {
  return value !== null && (TAB_KEYS as readonly string[]).includes(value);
}

export function AdminInquiryTabsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const rawTab = searchParams.get('tab');
  const activeTab: TabKey = isTabKey(rawTab) ? rawTab : DEFAULT_TAB;

  const setActiveTab = useCallback(
    (key: TabKey) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', key);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex: number | null = null;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % TABS.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + TABS.length) % TABS.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = TABS.length - 1;
    }
    if (nextIndex !== null) {
      e.preventDefault();
      const nextKey = TABS[nextIndex].key;
      setActiveTab(nextKey);
      tabRefs.current[nextKey]?.focus();
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-heading-dark font-display font-semibold text-2xl">
          문의 관리
        </h1>
      </div>

      {/* 탭 바 */}
      <div
        role="tablist"
        aria-label="문의 관리 탭"
        className="flex items-center gap-1 border-b border-border-light overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {TABS.map((tab, index) => {
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
                  ? 'shrink-0 -mb-px border-b-2 border-aircok-blue px-4 py-3 min-h-[44px] text-sm font-body font-semibold text-aircok-blue transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2 rounded-t-md'
                  : 'shrink-0 -mb-px border-b-2 border-transparent px-4 py-3 min-h-[44px] text-sm font-body text-secondary-dark hover:text-heading-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2 rounded-t-md'
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 패널들 (비활성은 hidden) */}
      <div
        role="tabpanel"
        id="panel-list"
        aria-labelledby="tab-list"
        hidden={activeTab !== 'list'}
        className="pt-6"
      >
        {activeTab === 'list' && <AdminInquiryListView />}
      </div>

      <div
        role="tabpanel"
        id="panel-mail"
        aria-labelledby="tab-mail"
        hidden={activeTab !== 'mail'}
        className="pt-6"
      >
        {activeTab === 'mail' && <AdminMailSettingView />}
      </div>

      <div
        role="tabpanel"
        id="panel-map"
        aria-labelledby="tab-map"
        hidden={activeTab !== 'map'}
        className="pt-6"
      >
        {activeTab === 'map' && <AdminMapSettingView />}
      </div>
    </div>
  );
}
