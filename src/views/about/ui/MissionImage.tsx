import Image from 'next/image'
import { connection } from 'next/server'
import { getProductSectionImageListServer } from '@/entities/product-section-image/server'
import {
  getSlotImage,
  type ProductSectionImage,
} from '@/entities/product-section-image'
import { PagePlaceholder } from '@/shared/ui'

/** R2(http)는 그대로, 상대 경로(/uploads)는 동일 출처 rewrite (TeamSection 과 동일 규칙). */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
function resolveSrc(src: string): string {
  if (src.startsWith('http')) return src
  return src.startsWith('/') ? src : `${API_BASE}${src}`
}

/** 이미지/폴백 공통 컨테이너 클래스 — 등록 전후로 레이아웃이 흔들리지 않게 한다(CLS 방지). */
const CONTAINER_CLASS = 'aspect-row-thumb w-full'
const ROUNDED_CLASS = 'rounded-card-lg'

/**
 * MISSION 우측 이미지의 폴백(슬롯 미등록/스트리밍 대기).
 * Suspense fallback 과 미등록 렌더가 동일 노드를 쓰도록 한곳에 둔다.
 */
export function MissionImageFallback() {
  return (
    <PagePlaceholder
      variant="surface"
      rounded={ROUNDED_CLASS}
      className={CONTAINER_CLASS}
      label="회사 · 팀 이미지 자리"
    />
  )
}

/**
 * MISSION 우측 이미지 — **async 서버 컴포넌트**(데이터).
 *
 * 섹션 전체를 async 로 만들지 않고 이미지 자리만 분리해 Suspense 로 스트리밍한다
 * (/about 라우트 셸 프리렌더 유지). `await connection()` 으로 빌드 프리렌더 시 fetch 를 미룬다.
 * 슬롯 미등록은 정상 케이스이며 폴백을 렌더한다.
 */
export async function MissionImage() {
  await connection()

  let images: ProductSectionImage[] = []
  try {
    images = await getProductSectionImageListServer()
  } catch {
    images = []
  }

  const src = getSlotImage(images, 'ABOUT_MISSION')
  if (!src) return <MissionImageFallback />

  return (
    <div
      className={`relative overflow-hidden ${ROUNDED_CLASS} ${CONTAINER_CLASS}`}
    >
      <Image
        src={resolveSrc(src)}
        alt="회사 · 팀 이미지"
        fill
        sizes="(min-width: 768px) 55vw, 100vw"
        className="object-cover"
      />
    </div>
  )
}
