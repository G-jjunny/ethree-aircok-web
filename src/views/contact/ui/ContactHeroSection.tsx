export function ContactHeroSection() {
  return (
    /* Page Sub-Hero 패턴 — design.md "Page Sub-Hero" 참조 */
    <section className="bg-surface-dark">
      {/* min-h-[480px] flex items-center: content-container에 적용 — section 직접 적용 시 중앙정렬 버그 발생 */}
      <div className="content-container min-h-[480px] flex items-center">
        <div className="flex flex-col gap-4 py-20">
          <span className="text-aircok-blue-light text-xs font-semibold uppercase tracking-widest">
            Contact
          </span>
          {/* max-w-[720px]: 헤드라인 읽기 편한 최대 줄 너비 — design.md "Page Sub-Hero" 참조 */}
          <h1 className="text-[28px] sm:text-[40px] font-semibold text-heading-light leading-[1.10] tracking-[-0.3px] [word-break:keep-all] max-w-[720px]">
            문의하기
          </h1>
          {/* max-w-[640px]: 본문 최적 읽기 너비 — design.md "Page Sub-Hero" 참조 */}
          <p className="text-[17px] text-body-light leading-[1.65] [word-break:keep-all] max-w-[640px]">
            궁금한 점이나 도움이 필요하신 내용을 편하게 남겨주세요.
          </p>
        </div>
      </div>
    </section>
  )
}
