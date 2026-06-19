'use client';
import { useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminMeQuery, useAdminLogoutMutation } from '@/features/admin-auth';
import { useAdminAuthStore } from '@/entities/admin-auth';
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
    logout(undefined, {
      onSettled: () => {
        setUser(null);
        router.push(SITE.admin.homePath);
      },
    });
  };

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
          <span className="text-heading-dark font-body font-semibold text-sm">어드민 콘솔</span>
          <div className="flex items-center gap-4">
            {user && <span className="text-secondary-dark text-sm">{user.username}</span>}
            <button
              onClick={handleLogout}
              className="text-sm text-error hover:opacity-70 transition-opacity"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
