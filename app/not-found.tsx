import Link from 'next/link'
import { SITE } from '@/shared/config'

export default function NotFound() {
  return (
    <main className="flex-1 bg-surface-dark flex items-center justify-center px-5">
      {/* 1회성: 404 페이지 전용 콘텐츠 컨테이너 최대 너비. design.md 컨테이너 규격에 없는 값. */}
      <div className="flex flex-col items-center text-center gap-6 max-w-[480px] w-full">
        {/* 1회성: 워터마크 404 전용 크기. design.md 타이포그래피 표에 없는 값. */}
        <p
          className="text-[120px] font-bold text-surface-dark-2 leading-none select-none"
          aria-hidden="true"
        >
          404
        </p>

        {/* 헤딩 */}
        <h1 className="text-3xl font-display font-semibold text-heading-light leading-[1.10] tracking-[-0.3px] [word-break:keep-all]">
          페이지를 찾을 수 없습니다
        </h1>

        {/* 부제 */}
        <p className="text-body-light text-[17px] leading-[1.65] [word-break:keep-all]">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>

        {/* CTA 버튼 2개 */}
        <div className="flex flex-wrap gap-3 justify-center mt-2">
          <Link
            href="/"
            className="bg-aircok-blue text-heading-light text-[17px] font-medium rounded-md px-5 py-[10px] hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors min-h-[44px] inline-flex items-center justify-center"
          >
            홈으로 돌아가기
          </Link>
          <Link
            href="/contact"
            className="border border-border-dark text-heading-light text-[17px] font-medium rounded-pill px-5 py-[10px] hover:bg-overlay-white-10 active:scale-[0.97] transition-colors min-h-[44px] inline-flex items-center justify-center"
          >
            {SITE.nav.cta}
          </Link>
        </div>
      </div>
    </main>
  )
}
