'use client';
import { useEffect, useState, type ReactNode } from 'react';
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

  useEffect(() => {
    if (isLoading) return;
    if (isError && !isLoginPage) {
      router.replace(SITE.admin.loginPath);
    }
    if (data?.user) {
      setUser(data.user);
    }
  }, [isError, isLoading, data, isLoginPage, router, setUser]);

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
      <header className="sticky top-0 z-50 bg-surface-white border-b border-border-light">
        <div className="flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-8">
            <span className="text-heading-dark font-body font-semibold text-sm">어드민 콘솔</span>
            <nav className="flex items-center gap-6">
              {SITE.admin.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    isNavActive(item.href)
                      ? 'text-sm font-body font-semibold text-aircok-blue'
                      : 'text-sm font-body text-secondary-dark hover:text-heading-dark transition-colors'
                  }
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {user && <span className="text-secondary-dark text-sm">{user.username}</span>}
            <button
              onClick={() => setLogoutOpen(true)}
              className="text-sm text-error hover:opacity-70 transition-opacity"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
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
