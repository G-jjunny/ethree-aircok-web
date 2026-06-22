/**
 * MapSetting 싱글톤 기본값 상수.
 *
 * 문의하기 페이지의 지도 표시용 주소 설정에서 사용한다.
 * inquiry.service 가 lazy 생성/기본값 반환 시 이 기본 주소를 사용한다.
 *
 * 프론트 SITE 상수(src/shared/config/site.ts)는 백엔드에서 import 할 수 없으므로,
 * 동일한 기본 주소 문자열을 백엔드 상수로 별도 보유한다.
 */

/** MapSetting 싱글톤 행의 고정 PK. */
export const MAP_SETTING_ID = 'singleton';

/** 기본 지도 주소(lazy 생성 시 사용). */
export const DEFAULT_MAP_ADDRESS =
  '서울특별시 성동구 아차산로17길 49 성수 생각공장 데시앙플렉스 815호';
