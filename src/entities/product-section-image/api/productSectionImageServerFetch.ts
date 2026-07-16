import 'server-only';
import axios from 'axios';
import { cacheLife, cacheTag } from 'next/cache';
import type { ProductSectionImage } from '../model/types';
import { PRODUCT_SECTION_IMAGES_CACHE_TAG } from './productSectionImageCacheTags';

/**
 * 서버/클라이언트 환경에 따라 API baseURL을 반환한다.
 *
 * Next.js rewrites는 브라우저 → Next.js 인바운드 요청에만 적용되므로,
 * 서버 컴포넌트에서는 NestJS를 직접 가리키는 절대 URL을 사용한다(news 패턴).
 */
function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.API_URL ?? 'http://localhost:3001/api';
  }
  return '/api';
}

/**
 * 섹션 이미지 목록 조회 + 캐싱(cacheTag: 'product-section-images').
 *
 * 실패 시 의도적으로 throw한다 — 'use cache' 스코프 안에서 던진 에러는 캐시에 저장되지
 * 않으므로, 백엔드 일시 장애가 cacheLife 기간 동안 빈 목록으로 굳는 것을 막는다.
 * 폴백은 캐시 밖(getProductSectionImageListServer)에서 처리한다.
 */
async function fetchProductSectionImageList(): Promise<ProductSectionImage[]> {
  'use cache';
  cacheLife('default');
  cacheTag(PRODUCT_SECTION_IMAGES_CACHE_TAG);

  const { data } = await axios.get<ProductSectionImage[]>(
    `${getApiBaseUrl()}/product-images`,
    { timeout: 10000 },
  );
  return data;
}

/**
 * 등록된 섹션 이미지 목록을 가져온다(서버 컴포넌트 전용).
 * GET /product-images — **등록된 슬롯만** 반환된다(미등록 슬롯은 응답에 없음).
 *
 * axiosInstance의 401 리다이렉트 인터셉터에 의존하지 않는 순수 axios 호출이므로
 * 서버 컴포넌트에서 직접 await할 수 있다.
 *
 * 백엔드 미가용/네트워크 오류 시 throw 대신 빈 배열을 반환한다(빌드 프리렌더 안전).
 * 빈 배열은 "전 슬롯 미등록"과 동일하게 취급되어 소비 측이 폴백을 렌더하므로,
 * 이미지 부재는 예외가 아니라 정상 렌더 경로다.
 */
export async function getProductSectionImageListServer(): Promise<
  ProductSectionImage[]
> {
  try {
    return await fetchProductSectionImageList();
  } catch {
    return [];
  }
}
