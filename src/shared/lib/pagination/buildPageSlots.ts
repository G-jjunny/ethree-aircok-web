/**
 * 페이지네이션 축약 슬롯(숫자 최대 7개): 첫/끝 + 현재 ±1 + 생략(…).
 * 전체 페이지 번호를 모두 렌더하면 페이지 다수 시 모바일(360px)에서 가로 넘침이
 * 발생하므로 슬롯 수를 고정한다. 'gap-*'는 생략 부호(…) 자리 표시자다.
 *
 * 도메인 무관 순수 로직이므로 shared/lib 에 위치한다 — 공개 뉴스 보드(NewsBoard)와
 * 관리자 뉴스 표(NewsTableSection)가 공유한다(#155, views 슬라이스 간 직접 import 금지).
 */
export type PageSlot = number | 'gap-left' | 'gap-right'

export function buildPageSlots(current: number, total: number): PageSlot[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  // 경계(1·2·끝-1·끝 페이지)에서도 항상 7슬롯을 유지하도록 창을 보정한다.
  const start = Math.max(2, Math.min(current - 1, total - 4))
  const end = Math.min(total - 1, Math.max(current + 1, 5))
  const slots: PageSlot[] = [1]
  if (start > 2) slots.push('gap-left')
  for (let page = start; page <= end; page += 1) slots.push(page)
  if (end < total - 1) slots.push('gap-right')
  slots.push(total)
  return slots
}
