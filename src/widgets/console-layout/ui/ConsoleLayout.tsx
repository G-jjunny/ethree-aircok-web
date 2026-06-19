'use client';
import { useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminMeQuery } from '@/features/admin-auth';
import { useAdminAuthStore } from '@/entities/admin-auth';
import { SITE } from '@/shared/config/site';

interface Props {
  children: ReactNode;
}

export function ConsoleLayout({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isError, isLoading } = useAdminMeQuery();
  const setUser = useAdminAuthStore((s) => s.setUser);

  const isLoginPage = pathname === SITE.admin.loginPath;

  useEffect(() => {
    if (isLoading) return;
    if (isError && !isLoginPage) {
      router.replace(SITE.admin.loginPath);
    }
    if (data?.user) {
      setUser(data.user);
    }
  }, [isError, isLoading, data, isLoginPage, router, setUser]);

  // 로그인 페이지는 인증 체크 없이 바로 렌더링
  if (isLoginPage) return <>{children}</>;

  // 인증 확인 중 (로딩)
  if (isLoading) return null;

  // 인증 실패 시 렌더링 막기 (리다이렉트 중)
  if (isError) return null;

  return <>{children}</>;
}
