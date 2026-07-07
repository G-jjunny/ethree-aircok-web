import axios from 'axios'
import { ApiError } from '@/shared/api'
import type { FaqCategory, FaqItem } from '../model/types'

/**
 * 서버 컴포넌트 전용 FAQ 조회 실패 에러.
 * 공통 판별(isAuthError 등)은 베이스 ApiError에서 제공한다.
 */
export class FaqServerApiError extends ApiError {}

/** FAQ 캐시 태그(카테고리·항목 공용). 어드민 FAQ 편집 뮤테이션 후 updateTag로 무효화한다. */
export const FAQ_CACHE_TAG = 'faq'

/**
 * 서버/클라이언트 환경에 따라 API baseURL을 반환한다.
 * 서버 컴포넌트에서는 NestJS를 직접 가리키는 절대 URL을 사용한다(news/service-image 패턴).
 */
function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.API_URL ?? 'http://localhost:3001/api'
  }
  return '/api'
}

/**
 * FAQ 카테고리 목록을 가져온다(서버 컴포넌트 안전).
 */
export async function getFaqCategoryList(): Promise<FaqCategory[]> {
  try {
    const { data } = await axios.get<{ data: FaqCategory[] }>(
      `${getApiBaseUrl()}/faq/categories`,
      { timeout: 10000 },
    )
    return data.data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new FaqServerApiError(
        err.response?.status ?? 0,
        'FAQ 카테고리를 불러오는 데 실패했습니다.',
      )
    }
    throw new FaqServerApiError(0, '네트워크 오류')
  }
}

/**
 * FAQ 전체 항목 목록을 가져온다(서버 컴포넌트 안전).
 */
export async function getFaqItemList(): Promise<FaqItem[]> {
  try {
    const { data } = await axios.get<{ data: FaqItem[] }>(
      `${getApiBaseUrl()}/faq/items`,
      { timeout: 10000 },
    )
    return data.data
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new FaqServerApiError(
        err.response?.status ?? 0,
        'FAQ 항목을 불러오는 데 실패했습니다.',
      )
    }
    throw new FaqServerApiError(0, '네트워크 오류')
  }
}
