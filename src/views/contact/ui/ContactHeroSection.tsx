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
            저희에게 연락주세요. 고객의 문제 해결을 위해 최선의 노력을 다하겠습니다.
          </h1>
          {/* max-w-[640px]: 본문 최적 읽기 너비 — design.md "Page Sub-Hero" 참조 */}
          <p className="text-[17px] text-body-light leading-[1.65] [word-break:keep-all] max-w-[640px]">
            귀사의 연락에 감사드립니다. 24시간 이내에 문의에 대한 답변을 드리겠습니다.
          </p>
        </div>
      </div>
    </section>
  )
}
