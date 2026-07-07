'use server'

import { updateTag } from 'next/cache'
import { FAQ_CACHE_TAG } from './faqServerFetch'

/**
 * FAQ 캐시(getFaqCategoryList/getFaqItemList, cacheTag: 'faq')를 온디맨드 무효화한다.
 * 어드민 FAQ 카테고리·항목 편집 뮤테이션 onSuccess에서 호출한다.
 */
export async function revalidateFaqCache(): Promise<void> {
  updateTag(FAQ_CACHE_TAG)
}
