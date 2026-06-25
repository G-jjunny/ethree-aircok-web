import { SITE } from '@/shared/config/site';
import { AdminLoginForm } from '@/features/admin-login-form';

export function AdminLoginView() {
  return (
    <main className="min-h-screen bg-surface-light flex items-center justify-center px-5 py-12">
      {/* max-w-[420px]: 로그인 카드 전용 너비. 토큰 없음 — design.md §15.4에 사유 문서화 */}
      <div className="bg-surface-white rounded-xl shadow-card w-full max-w-[420px] overflow-hidden flex flex-col">
        {/* 카드 상단 헤더 — §15.4 Login Page */}
        <div className="bg-aircok-blue px-8 py-8 flex flex-col items-center gap-2">
          <p className="text-heading-light text-[22px] font-display font-semibold leading-snug">
            {SITE.name}
          </p>
          <p className="text-heading-light/70 text-[15px]">
            관리자 로그인
          </p>
        </div>
        {/* 폼 영역 */}
        <div className="px-8 py-8">
          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}
