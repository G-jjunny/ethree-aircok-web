'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SITE } from '@/shared/config';
import { Button } from '@/shared/ui';

/**
 * 전역 헤더 (시안 §1). 다크 글래스: bg-navy/72 + backdrop-blur, 하단 hairline(white/8).
 * 데스크톱은 로고(흰색) + nav 링크 + 도입 문의 pill, 모바일은 햄버거 드롭다운.
 */
export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy/72 backdrop-blur-xl border-b border-white/8">
      <div className="content-container flex items-center gap-4 py-4">
        {/* 로고 (흰색) */}
        <Link href="/" aria-label={SITE.name} className="flex items-center">
          {/* width/height 는 에셋 고유 크기(200x71) — 두 값이 고유비와 일치해야 next/image
              종횡비 경고가 발생하지 않는다. 표시 크기는 CSS 로만 제어한다.
              h-7.5 = 30px (기본 4px 그리드 파생: 7.5 × 4). ⚠️ globals.css 의 구 커스텀
              스케일(--spacing-5~10, 7=48px)은 정수 스텝만 덮으므로 7.5 는 오염되지 않고,
              해당 블록 제거 후에도 30px 로 유지된다. */}
          <Image
            src="/images/logos/logo-white.png"
            alt={SITE.name}
            width={200}
            height={71}
            className="h-7.5 w-auto"
            priority
          />
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="ml-auto hidden md:flex items-center gap-5 text-sm font-medium">
          {SITE.nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/82 hover:text-white transition-colors duration-fast"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* 우측 CTA + 모바일 토글 */}
        <div className="ml-auto md:ml-0 flex items-center gap-3">
          <Button asChild pill variant="primary" size="sm">
            <Link href="/contact">{SITE.nav.cta}</Link>
          </Button>

          <button
            type="button"
            className="md:hidden -m-2 flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5"
            aria-label="메뉴 열기"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <span
              className={`block w-5 h-0.5 bg-white transition-transform duration-fast ${
                mobileOpen ? 'translate-y-2 rotate-45' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-white transition-opacity duration-fast ${
                mobileOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-white transition-transform duration-fast ${
                mobileOpen ? '-translate-y-2 -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 */}
      {mobileOpen && (
        <div className="md:hidden bg-navy backdrop-blur-xl border-t border-white/8">
          <nav className="content-container py-3 flex flex-col">
            {SITE.nav.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/82 text-sm py-3 border-b border-white/8 last:border-b-0 hover:text-white transition-colors duration-fast"
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
