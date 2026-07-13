/**
 * 뉴스 데이터 0건일 때(서버 데이터 자체 없음) 표시하는 빈 상태.
 * 페이지 헤더는 PageHero(shared/ui)로 분리됨.
 */
export function NewsEmptySection() {
  return (
    <section className="bg-surface-white py-14 md:py-20">
      <div className="content-container">
        <div className="rounded-image border border-hairline bg-surface px-6 py-16 text-center">
          <p className="text-lg font-bold text-ink">등록된 뉴스가 없습니다</p>
          <p className="mt-2 text-sm text-muted">
            새로운 소식이 준비되는 대로 이곳에서 전해드리겠습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
