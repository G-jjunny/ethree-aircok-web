import { SITE } from '@/shared/config/site';
import { AdminLoginForm } from '@/features/admin-login-form';

export function AdminLoginView() {
  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-5 py-12">
      {/* max-w-[420px]: 단일 인증 카드 전용 너비. 표준 content(1240)/reading(760)보다 좁은 1회성 수치 — token 없음: 로그인 전용 예외 폭(design.md §5 예외 규칙에 따라 사유 주석 유지) */}
      <div className="w-full max-w-[420px] flex flex-col gap-8 rounded-card-lg border border-hairline bg-surface-white px-8 py-10 shadow-card">
        {/* 브랜드 헤더 — 워드마크(Sora) + 한글 타이틀(Pretendard) */}
        <header className="flex flex-col items-center gap-2 text-center">
          <p className="font-display text-sm font-bold uppercase tracking-eyebrow-lg text-brand">
            {SITE.nameEn}
          </p>
          <h1 className="font-body text-2xl font-extrabold tracking-headline text-ink">
            관리자 로그인
          </h1>
          <p className="font-body text-sm text-muted">
            {SITE.name} 콘솔 계정으로 로그인하세요
          </p>
        </header>

        <AdminLoginForm />
      </div>
    </main>
  );
}
