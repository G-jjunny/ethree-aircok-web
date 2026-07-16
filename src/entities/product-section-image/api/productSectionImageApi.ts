import axios from 'axios';
import { queryOptions } from '@tanstack/react-query';
import { axiosInstance, ApiError, authAwareRetry } from '@/shared/api';
import type { ProductSectionImage } from '../model/types';
import { productSectionImageKeys } from './productSectionImageKeys';

// NOTE: 서버 페처(getProductSectionImageListServer)는 'use cache'(next/cache)를 사용하는
// 서버 전용 모듈에서만 노출한다. 이 모듈은 클라이언트 배럴(index.ts)로 re-export되므로
// 여기서 재노출하면 next/cache가 클라이언트 번들로 끌려온다.

/** 섹션 이미지 API 에러. 베이스 {@link ApiError}를 상속만 한다(공통 판별은 베이스 제공). */
export class ProductSectionImageApiError extends ApiError {}

/**
 * 등록된 섹션 이미지 목록을 가져온다(클라이언트 소비용).
 * GET /product-images — **등록된 슬롯만** 배열로 반환된다(미등록 슬롯은 응답에 없음).
 * 슬롯 단위 조회는 getSlotImage/toSlotImageMap 헬퍼를 사용한다.
 */
export async function getProductSectionImageList(): Promise<
  ProductSectionImage[]
> {
  try {
    const { data } =
      await axiosInstance.get<ProductSectionImage[]>('/product-images');
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      throw new ProductSectionImageApiError(
        status,
        status === 0
          ? '네트워크 오류로 섹션 이미지를 불러오지 못했습니다.'
          : '섹션 이미지를 불러오는 데 실패했습니다.',
      );
    }
    throw new ProductSectionImageApiError(
      0,
      '네트워크 오류로 섹션 이미지를 불러오지 못했습니다.',
    );
  }
}

/**
 * 섹션 이미지 목록 TanStack Query 옵션.
 * 데이터 페칭의 주 경로는 서버(server.ts)이며, 이 옵션은 클라이언트 소비 경로용이다.
 */
export function productSectionImageListQueryOptions() {
  return queryOptions({
    queryKey: productSectionImageKeys.all,
    queryFn: getProductSectionImageList,
    staleTime: 1000 * 60 * 5, // 5분
    retry: authAwareRetry,
  });
}
