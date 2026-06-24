import { queryOptions } from '@tanstack/react-query'
import { axiosInstance, ApiError, authAwareRetry } from '@/shared/api'
import type { FaqItem } from '../model/types'

/**
 * FAQ 항목 API 호출 실패를 나타내는 에러.
 * 공통 판별(isAuthError 등)은 베이스 ApiError에서 제공한다.
 */
export class FaqItemApiError extends ApiError {}

/**
 * FAQ 항목 관련 TanStack Query 키 팩토리.
 */
export const faqItemKeys = {
  all: ['faq-items'] as const,
  byCategory: (categoryId: string) =>
    [...faqItemKeys.all, { categoryId }] as const,
}

/**
 * FAQ 전체 항목 목록 TanStack Query 옵션.
 * 클라이언트 컴포넌트 전용 — axiosInstance는 브라우저 환경에서만 동작한다.
 * API 응답: { data: FaqItem[] }
 */
export function faqItemQueryOptions() {
  return queryOptions({
    queryKey: faqItemKeys.all,
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: FaqItem[] }>('/faq/items')
      return data.data
    },
    retry: authAwareRetry,
  })
}

/**
 * 특정 카테고리의 FAQ 항목 목록 TanStack Query 옵션.
 * GET /api/faq/items?categoryId=xxx
 * API 응답: { data: FaqItem[] }
 */
export function faqItemByCategoryQueryOptions(categoryId: string) {
  return queryOptions({
    queryKey: faqItemKeys.byCategory(categoryId),
    queryFn: async () => {
      const { data } = await axiosInstance.get<{ data: FaqItem[] }>('/faq/items', {
        params: { categoryId },
      })
      return data.data
    },
    retry: authAwareRetry,
  })
}
