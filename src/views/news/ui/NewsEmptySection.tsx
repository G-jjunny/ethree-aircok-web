/**
 * 뉴스 데이터 0건일 때 표시하는 빈 상태.
 * 페이지 헤더는 PageHero(shared/ui)로 분리됨.
 */
export function NewsEmptySection() {
  return (
    <section className="bg-surface-light py-16 md:py-20">
      <div className="content-container">
        <div className="py-24 text-center">
          <p className="text-secondary-dark font-body text-[17px]">
            등록된 뉴스가 없습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
