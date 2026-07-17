import 'server-only';
import axios from 'axios';
import { cacheLife, cacheTag } from 'next/cache';
import type { Certification } from '../model/types';
import { CERTIFICATIONS_CACHE_TAG } from './certificationCacheTags';

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
 * 인증서·특허증 공개 목록 조회 + 캐싱(cacheTag: 'certifications').
 *
 * 실패 시 의도적으로 throw한다 — 'use cache' 스코프 안에서 던진 에러는 캐시에 저장되지
 * 않으므로, 백엔드 일시 장애가 cacheLife 기간 동안 빈 목록으로 굳는 것을 막는다.
 * 폴백은 캐시 밖(getCertificationListServer)에서 처리한다.
 */
async function fetchCertificationList(): Promise<Certification[]> {
  'use cache';
  cacheLife('default');
  cacheTag(CERTIFICATIONS_CACHE_TAG);

  const { data } = await axios.get<Certification[]>(
    `${getApiBaseUrl()}/certifications`,
    { timeout: 10000 },
  );
  return data;
}

/**
 * 인증서·특허증 공개 목록을 가져온다(서버 컴포넌트 전용).
 * GET /certifications — order ASC로 백엔드가 정렬해 반환한다.
 *
 * 백엔드 미가용/네트워크 오류 시 throw 대신 빈 배열을 반환한다(빌드 프리렌더 안전).
 * 빈 배열은 소비 측이 갤러리를 숨기고 통계만 렌더하므로, 인증서 부재는 정상 렌더 경로다.
 */
export async function getCertificationListServer(): Promise<Certification[]> {
  try {
    return await fetchCertificationList();
  } catch {
    return [];
  }
}
