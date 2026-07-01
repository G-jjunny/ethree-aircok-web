/**
 * Daum(카카오) 우편번호 서비스 v2 최소 타입 선언.
 *
 * 외부 CDN 스크립트(postcode.v2.js)가 런타임에 `window.daum`을 주입하므로,
 * 슬라이스 내부에서 최소 범위로 전역 augmentation 한다.
 * (별도 .d.ts 전역 파일 대신 슬라이스 로컬 모듈로 두어 전역 오염을 최소화)
 *
 * oncomplete의 data 중 이 폼에서 실제 사용하는 필드만 정의한다.
 */
export interface DaumPostcodeData {
  /** 도로명 주소 (우선 사용) */
  roadAddress: string;
  /** 지번 주소 (도로명이 없을 때 사용) */
  jibunAddress: string;
  /** 사용자가 선택한 기본 주소 (roadAddress 또는 jibunAddress) */
  address: string;
  /** 우편번호 (5자리) */
  zonecode: string;
  /** 건물명 (예: "성수 생각공장 데시앙플렉스"). 없으면 빈 문자열 */
  buildingName: string;
}

export interface DaumPostcodeOptions {
  oncomplete: (data: DaumPostcodeData) => void;
}

export interface DaumPostcodeInstance {
  open: () => void;
}

export interface DaumPostcodeConstructor {
  new (options: DaumPostcodeOptions): DaumPostcodeInstance;
}

export interface DaumNamespace {
  Postcode: DaumPostcodeConstructor;
}

declare global {
  interface Window {
    daum?: DaumNamespace;
  }
}
