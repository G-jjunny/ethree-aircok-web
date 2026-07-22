import { queryOptions } from '@tanstack/react-query'
import { axiosInstance, ApiError, authAwareRetry } from '@/shared/api'
import type { FaqCategory } from '../model/types'

/**
 * FAQ 카테고리 API 호출 실패를 나타내는 에러.
 * 공통 판별(isAuthError 등)은 베이스 ApiError에서 제공한다.
 */
export class FaqCategoryApiError extends ApiError {}

/**
 * FAQ 카테고리 관련 TanStack Query 키 팩토리.
 * invalidateQueries는 prefix 부분 일치로 동작하므로,
 * 전체 무효화는 faqCategoryKeys.all만으로 충분하다.
 */
export const faqCategoryKeys = {
  all: ['faq-categories'] as const,
}

/**
 * FAQ 카테고리 목록 TanStack Query 옵션.
 * 클라이언트 컴포넌트 전용 — axiosInstance는 브라우저 환경에서만 동작한다.
 * API 응답: { data: FaqCategory[] }
 */
export function faqCategoryQueryOptions() {
  return queryOptions({
    queryKey: faqCategoryKeys.all,
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: FaqCategory[] }>('/faq/categories')
      return data.data
    },
    retry: authAwareRetry,
  })
}
