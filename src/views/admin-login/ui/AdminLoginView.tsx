import { SITE } from '@/shared/config/site';
import { AdminLoginForm } from '@/features/admin-login-form';

export function AdminLoginView() {
  return (
    <main className="min-h-screen bg-surface-light flex items-center justify-center px-5 py-12">
      {/* max-w-[400px]: 로그인 카드 전용 너비. 토큰 없음 — design.md §9에 사유 문서화 */}
      <div className="bg-surface-white rounded-xl shadow-card w-full max-w-[400px] px-8 py-10 flex flex-col gap-8">
        <div className="flex flex-col gap-2 items-center text-center">
          <p className="text-[21px] font-bold text-heading-dark leading-[1.19]">
            {SITE.name}
          </p>
          <p className="text-[15px] text-secondary-dark leading-[1.43]">
            관리자 로그인
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </main>
  );
}
