'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { useAdminMeQuery, useAdminLogoutMutation } from '@/features/admin-auth';
import { useAdminAuthStore } from '@/entities/admin-auth';
import { ConfirmDialog } from '@/shared/ui';
import { SITE } from '@/shared/config/site';

interface Props {
  children: ReactNode;
}

export function ConsoleLayout({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === SITE.admin.loginPath;
  const { data, isError, isLoading } = useAdminMeQuery({ enabled: !isLoginPage });
  const setUser = useAdminAuthStore((s) => s.setUser);
  const user = useAdminAuthStore((s) => s.user);
  const { mutate: logout } = useAdminLogoutMutation();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    if (isLoading) return;
    if (isError && !isLoginPage) {
      router.replace(SITE.admin.loginPath);
    }
    if (data?.user) {
      setUser(data.user);
    }
  }, [isError, isLoading, data, isLoginPage, router, setUser]);

  // 라우트 변경 시 모바일 드로어 닫기 (실제 경로 변화가 있을 때만 setState)
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      setDrawerOpen(false);
    }
  }, [pathname]);

  const handleLogout = () => {
    setLogoutLoading(true);
    logout(undefined, {
      onSettled: () => {
        setUser(null);
        setLogoutLoading(false);
        setLogoutOpen(false);
        toast.success('로그아웃되었습니다');
        router.push(SITE.admin.homePath);
      },
    });
  };

  const isNavActive = (href: string) =>
    href === SITE.admin.basePath
      ? pathname === href
      : pathname.startsWith(href);

  // 로그인 페이지는 인증 체크 없이 바로 렌더링
  if (isLoginPage) return <>{children}</>;

  // 인증 확인 중 (로딩)
  if (isLoading) return null;

  // 인증 실패 시 렌더링 막기 (리다이렉트 중)
  if (isError) return null;

  return (
    <div className="min-h-screen bg-surface-light">
      {/* 모바일 상단 바 */}
      <div className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-surface-white border-b border-border-light lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="메뉴 열기"
          aria-expanded={drawerOpen}
          aria-controls="console-sidebar"
          className="inline-flex items-center justify-center w-11 h-11 -ml-2 rounded-md text-heading-dark hover:bg-surface-light transition-colors"
        >
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
            />
          </svg>
        </button>
        <span className="text-heading-dark font-body font-semibold text-sm">
          어드민 콘솔
        </span>
        <span className="w-11" aria-hidden="true" />
      </div>

      {/* 드로어 오버레이 (모바일, 열림 시) */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-overlay-dark-60 lg:hidden"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 사이드바 (데스크탑 고정 / 모바일 드로어) */}
      <aside
        id="console-sidebar"
        aria-label="콘솔 메뉴"
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-surface-white border-r border-border-light flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center h-14 px-5 border-b border-border-light shrink-0">
          <span className="text-heading-dark font-body font-semibold text-sm">
            어드민 콘솔
          </span>
        </div>
        <nav
          aria-label="콘솔 내비게이션"
          className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto"
        >
          {SITE.admin.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isNavActive(item.href) ? 'page' : undefined}
              onClick={() => setDrawerOpen(false)}
              className={
                isNavActive(item.href)
                  ? 'flex items-center gap-3 rounded-md px-3 py-2.5 min-h-[44px] text-sm font-body font-semibold bg-aircok-blue/10 text-aircok-blue transition-colors'
                  : 'flex items-center gap-3 rounded-md px-3 py-2.5 min-h-[44px] text-sm font-body text-secondary-dark hover:bg-surface-light hover:text-heading-dark transition-colors'
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-border-light p-3 flex flex-col gap-2 shrink-0">
          {user && (
            <span className="text-secondary-dark text-sm px-3 truncate">
              {user.username}
            </span>
          )}
          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="flex items-center gap-2 rounded-md px-3 py-2.5 min-h-[44px] text-sm font-body text-error hover:bg-surface-light transition-colors text-left"
          >
            로그아웃
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="lg:pl-60">{children}</main>

      <ConfirmDialog
        open={logoutOpen}
        variant="default"
        title="로그아웃"
        description="정말 로그아웃 하시겠습니까?"
        confirmLabel="로그아웃"
        loading={logoutLoading}
        onConfirm={handleLogout}
        onCancel={() => {
          if (!logoutLoading) setLogoutOpen(false);
        }}
      />
    </div>
  );
}
