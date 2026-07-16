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

/**
 * 어드민 섹션 이미지 목록을 브라우저에서 직접 호출한다.
 * GET /product-images/admin — JWT 필요. axiosInstance는 withCredentials이므로 쿠키가 자동 전송된다.
 *
 * 결과 집합은 공개 GET /product-images와 **100% 동일**하다. 이 모델에는 published 같은
 * 행 필터 컬럼이 없어 필터링 자체가 없고, 두 엔드포인트가 갈리는 축은 **인증과 캐시 정책뿐**이다.
 * (공개 GET은 `Cache-Control: public, max-age=60`이라 삭제 직후에도 브라우저 HTTP 캐시가
 * 낡은 응답을 돌려주는 반면, 어드민 GET은 `no-store`라 read-after-write가 보장된다.)
 * 반환 타입도 같은 이유로 ProductSectionImage[]로 동일하다.
 *
 * 어드민 화면(클라이언트 컴포넌트) 전용 — 서버에서 호출하지 않는다.
 */
export async function getAdminProductSectionImageList(): Promise<
  ProductSectionImage[]
> {
  try {
    const { data } =
      await axiosInstance.get<ProductSectionImage[]>('/product-images/admin');
    return data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 0;
      const message =
        status === 401 || status === 403
          ? '로그인이 필요합니다.'
          : status === 0
            ? '네트워크 오류로 섹션 이미지를 불러오지 못했습니다.'
            : '섹션 이미지를 불러오는 데 실패했습니다.';
      throw new ProductSectionImageApiError(status, message);
    }
    throw new ProductSectionImageApiError(
      0,
      '네트워크 오류로 섹션 이미지를 불러오지 못했습니다.',
    );
  }
}

/**
 * 어드민 섹션 이미지 목록 TanStack Query 옵션.
 * 인증 의존 데이터이므로 staleTime을 0으로 두고, 인증 실패(401/403)는 재시도하지 않는다.
 */
export function adminProductSectionImageListQueryOptions() {
  return queryOptions({
    queryKey: productSectionImageKeys.admin,
    queryFn: getAdminProductSectionImageList,
    staleTime: 0,
    retry: authAwareRetry,
  });
}
