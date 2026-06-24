"use client";

import type { FaqItem } from "@/entities/faq";

// 카테고리별 질문 번호 접두어 및 순번을 계산하는 헬퍼
function getQuestionBadge(item: FaqItem, categoryIndex: number): string {
  return String(categoryIndex + 1).padStart(2, "0");
}

interface AccordionItemProps {
  item: FaqItem;
  badge: string;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ item, badge, isOpen, onToggle }: AccordionItemProps) {
  const answerId = `faq-answer-${item.id}`;
  const paragraphs = item.answer.split("\n\n");

  return (
    <div
      className={`border-b border-border-light transition-colors ${isOpen ? "bg-surface-light rounded-lg px-4" : ""}`}
    >
      <button
        type="button"
        className="flex items-center justify-between w-full gap-4 py-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:rounded-sm"
        id={`faq-question-${item.id}`}
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={onToggle}
      >
        {/* 배지 + 질문 텍스트 묶음 */}
        <span className="flex items-center gap-3 min-w-0">
          <span
            className="shrink-0 text-[13px] font-bold text-aircok-blue leading-none tabular-nums"
            aria-hidden="true"
          >
            {badge}
          </span>
          <span className="text-[17px] font-semibold text-heading-dark leading-[1.47] [word-break:keep-all] text-left">
            Q. {item.question}
          </span>
        </span>

        {/* 토글 아이콘 */}
        <span
          className={`shrink-0 w-6 h-6 flex items-center justify-center transition-colors ${
            isOpen ? "text-aircok-blue" : "text-secondary-dark"
          }`}
          aria-hidden="true"
        >
          {isOpen ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 8h12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2v12M2 8h12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </span>
      </button>

      {/*
        CSS grid-rows 트릭으로 부드러운 열림/닫힘 애니메이션.
        grid-rows-[1fr] / grid-rows-[0fr] 은 fr 단위 애니메이션 전용 수치로 허용.
      */}
      <div
        id={answerId}
        role="region"
        aria-labelledby={`faq-question-${item.id}`}
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-5">
            {/* border는 텍스트 높이에만 걸리도록 래퍼를 분리 — pb-5는 border 바깥 */}
            <div className="border-l-2 border-aircok-blue pl-4 py-1 flex flex-col gap-3">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-[17px] text-body-dark leading-[1.65] [word-break:keep-all]"
                >
                  {index === 0 ? `A. ${paragraph}` : paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FaqAccordionProps {
  /** 표시할 FAQ 아이템 목록 (이미 카테고리·검색 필터가 적용된 상태) */
  items: FaqItem[];
  /** 각 아이템의 카테고리 내 원래 순번 (배지 계산용, items와 동일 길이) */
  categoryIndexes: number[];
  openItemId: string | null;
  onToggle: (id: string) => void;
  searchQuery: string;
}

export function FaqAccordion({
  items,
  categoryIndexes,
  openItemId,
  onToggle,
  searchQuery,
}: FaqAccordionProps) {
  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-[17px] text-secondary-dark [word-break:keep-all]">
          검색 결과가 없습니다.
        </p>
        {searchQuery.trim().length > 0 && (
          <p className="text-[15px] text-secondary-dark mt-2">
            다른 키워드로 검색해 보세요.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="border-t border-border-light">
      {items.map((item, idx) => (
        <AccordionItem
          key={item.id}
          item={item}
          badge={getQuestionBadge(item, categoryIndexes[idx])}
          isOpen={openItemId === item.id}
          onToggle={() => onToggle(item.id)}
        />
      ))}
    </div>
  );
}
