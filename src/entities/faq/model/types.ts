export interface FaqCategory {
  id: string
  name: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface FaqItem {
  id: string
  categoryId: string
  categoryName: string  // API 계약 — 플랫 구조
  question: string
  answer: string
  order: number
  createdAt: string
  updatedAt: string
}
