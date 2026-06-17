'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SITE } from '@/shared/config';

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-nav-bg backdrop-blur-xl backdrop-saturate-180 border-b border-border-light">
      <div className="max-w-[1200px] mx-auto px-5 h-[52px] flex items-center justify-between">
        {/* 로고 */}
        <Link href="/" className="font-display font-semibold text-heading-dark text-base">
          {SITE.name}
        </Link>

        {/* 데스크탑 네비게이션 (834px 이상) */}
        <nav className="hidden md:flex items-center gap-6">
          {SITE.nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-body-dark text-sm hover:text-heading-dark transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* 우측 영역 */}
        <div className="flex items-center gap-3">
          {/* CTA 버튼 (항상 표시) */}
          <Link
            href="/contact"
            className="bg-aircok-blue text-heading-light rounded-md px-4 py-2 text-sm font-medium hover:bg-aircok-blue-dark transition-colors"
          >
            {SITE.nav.cta}
          </Link>

          {/* 햄버거 버튼 (834px 미만) */}
          <button
            type="button"
            className="md:hidden flex flex-col gap-1.5 p-1"
            aria-label="메뉴 열기"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <span
              className={`block w-5 h-0.5 bg-heading-dark transition-transform duration-200 ${
                mobileOpen ? 'translate-y-2 rotate-45' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-heading-dark transition-opacity duration-200 ${
                mobileOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-heading-dark transition-transform duration-200 ${
                mobileOpen ? '-translate-y-2 -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {mobileOpen && (
        <div className="md:hidden bg-nav-bg-mobile backdrop-blur-xl border-t border-border-light">
          <nav className="max-w-[1200px] mx-auto px-5 py-3 flex flex-col">
            {SITE.nav.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-body-dark text-sm py-3 border-b border-border-subtle last:border-b-0 hover:text-heading-dark transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
