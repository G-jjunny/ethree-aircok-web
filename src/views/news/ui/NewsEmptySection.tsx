import { SITE } from '@/shared/config';

/**
 * 뉴스 데이터 0건일 때 Featured 섹션 자리에 표시하는 빈 상태.
 */
export function NewsEmptySection() {
  return (
    <section className="bg-surface-light py-16 md:py-20">
      <div className="content-container flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <p className="text-aircok-blue text-sm font-body tracking-widest uppercase">
            NEWS
          </p>
          <h1 className="text-[40px] font-display font-semibold text-heading-dark leading-[1.10] tracking-[-0.3px] [word-break:keep-all]">
            {SITE.pages.news.title}
          </h1>
        </div>
        <div className="py-24 text-center">
          <p className="text-secondary-dark font-body text-[17px]">
            등록된 뉴스가 없습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
