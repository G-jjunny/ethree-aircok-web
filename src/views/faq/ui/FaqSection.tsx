import { connection } from 'next/server'
import { SectionHeader } from '@/shared/ui'
import {
  getFaqCategoryList,
  getFaqItemList,
  type FaqCategory,
  type FaqItem,
} from '@/entities/faq'
import { FaqBrowser } from './FaqBrowser'

export async function FaqSection() {
  // 빌드 타임 프리렌더(백엔드 미기동)에서 fetch가 실행되지 않도록 요청 시점으로 미룬다.
  await connection()

  let categories: FaqCategory[] = []
  let items: FaqItem[] = []
  try {
    const [categoryList, itemList] = await Promise.all([
      getFaqCategoryList(),
      getFaqItemList(),
    ])
    categories = categoryList
    items = itemList
  } catch {
    categories = []
    items = []
  }

  return (
    <section className="bg-surface-white py-20 md:py-28">
      {/* token 없음: FAQ 2컬럼 전용 너비 1000px — 사이드바 200px + 아코디언 영역 적정 폭 확보 */}
      <div className="max-w-[1000px] mx-auto px-5">
        <SectionHeader
          label="자주 묻는 질문"
          title="FAQ"
          theme="light"
          titleAs="h2"
        />

        <FaqBrowser categories={categories} items={items} />
      </div>
    </section>
  )
}
