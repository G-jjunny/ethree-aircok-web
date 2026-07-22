import { connection } from 'next/server'
import { cacheLife, cacheTag } from 'next/cache'
import { SectionLabel } from '@/shared/ui'
import {
  getFaqCategoryList,
  getFaqItemList,
  FAQ_CACHE_TAG,
  type FaqCategory,
  type FaqItem,
} from '@/entities/faq'
import { ContactFaqBrowser } from './ContactFaqBrowser'

/** FAQ 카테고리 조회를 'use cache'로 캐싱(cacheTag: 'faq', cacheLife: default). */
async function getCachedFaqCategories(): Promise<FaqCategory[]> {
  'use cache'
  cacheLife('default')
  cacheTag(FAQ_CACHE_TAG)
  return getFaqCategoryList()
}

/** FAQ 항목 조회를 'use cache'로 캐싱(cacheTag: 'faq', cacheLife: default). */
async function getCachedFaqItems(): Promise<FaqItem[]> {
  'use cache'
  cacheLife('default')
  cacheTag(FAQ_CACHE_TAG)
  return getFaqItemList()
}

/**
 * FAQ 섹션 (시안 §FAQ). 구 /faq 페이지를 문의하기 하단으로 통합.
 * surface 배경, 상단 border, id=faq(구 /faq 리다이렉트 앵커).
 */
export async function ContactFaqSection() {
  // 빌드 타임 프리렌더(백엔드 미기동)에서 fetch가 실행되지 않도록 요청 시점으로 미룬다.
  await connection()

  let categories: FaqCategory[] = []
  let items: FaqItem[] = []
  try {
    const [categoryList, itemList] = await Promise.all([
      getCachedFaqCategories(),
      getCachedFaqItems(),
    ])
    categories = categoryList
    items = itemList
  } catch {
    categories = []
    items = []
  }

  return (
    <section
      id="faq"
      className="scroll-mt-24 border-t border-hairline bg-surface"
    >
      <div className="content-container py-20 md:py-24">
        <div className="max-w-[640px]">
          {/* token 없음: max-w-[640px] 섹션 헤더 프로즈 폭(1회성) */}
          <SectionLabel color="brand">FAQ</SectionLabel>
          <h2 className="mt-4 font-display text-h4 font-extrabold tracking-headline text-ink">
            자주 묻는 질문
          </h2>
          <p className="mt-4 text-lead-sm leading-relaxed text-muted [word-break:keep-all]">
            문의 전 자주 묻는 질문을 먼저 확인해 보세요. 원하는 답변이 없다면 위
            문의 폼으로 남겨주세요.
          </p>
        </div>

        <ContactFaqBrowser categories={categories} items={items} />
      </div>
    </section>
  )
}
