import type { ReactNode } from 'react';
import Image from 'next/image';
import { connection } from 'next/server';
import { getProductSectionImageListServer } from '@/entities/product-section-image/server';
import {
  getSlotImage,
  type ProductImageSlot,
  type ProductSectionImage,
} from '@/entities/product-section-image';

/**
 * 백엔드 업로드 이미지 베이스. NewsImage / services·diagnosis SlotImage 와 동일 규칙:
 * R2(절대 http URL)는 그대로, 상대 경로(/uploads/...)는 next.config 의 `/uploads` rewrite 로
 * 동일 출처 서빙되므로 그대로 둔다.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

function resolveSrc(src: string): string {
  if (src.startsWith('http')) return src;
  return src.startsWith('/') ? src : `${API_BASE}${src}`;
}

type HomeSlotImageProps = {
  slot: ProductImageSlot;
  alt: string;
  /** next/image sizes. fill 이미지이므로 레이아웃상 실제 표시 폭에 맞춘다. */
  sizes?: string;
  /** object-fit. 기본 cover. 일러스트처럼 잘리면 안 되는 이미지는 contain. */
  fit?: 'cover' | 'contain';
  /**
   * 슬롯 미등록(정상 케이스)일 때 렌더할 폴백.
   * Suspense fallback 에도 **동일한 노드**를 넘겨 스트리밍 전/후 레이아웃을 일치시킨다.
   */
  fallback?: ReactNode;
};

/**
 * 홈 섹션 이미지 슬롯 렌더러 — **async 서버 컴포넌트**(데이터).
 *
 * 홈은 정적 프리렌더 셸을 유지해야 하므로, 섹션 전체를 async 로 만들지 않고
 * 이미지 자리만 이 컴포넌트로 분리해 `<Suspense>` 경계 안에서 스트리밍한다
 * (services/diagnosis 의 "정적 프레젠테이션 + async 데이터 컴포넌트" 분리 패턴).
 *
 * `await connection()` 으로 빌드 타임 프리렌더(백엔드 미기동)에서 fetch 가 실행되지 않게 하고,
 * 실패/미등록은 예외가 아니라 폴백 렌더 경로다.
 *
 * 부모가 `relative` + 비율 컨테이너를 소유하며, 여기서는 fill 이미지만 채운다.
 */
export async function HomeSlotImage({
  slot,
  alt,
  sizes = '100vw',
  fit = 'cover',
  fallback = null,
}: HomeSlotImageProps) {
  await connection();

  let images: ProductSectionImage[] = [];
  try {
    images = await getProductSectionImageListServer();
  } catch {
    images = [];
  }

  const src = getSlotImage(images, slot);
  if (!src) return <>{fallback}</>;

  return (
    <Image
      src={resolveSrc(src)}
      alt={alt}
      fill
      sizes={sizes}
      className={fit === 'contain' ? 'object-contain' : 'object-cover'}
    />
  );
}
