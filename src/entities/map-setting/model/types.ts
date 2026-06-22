/**
 * 문의 페이지 지도 주소 설정 (싱글톤).
 * 백엔드 응답과 1:1 — GET·PUT 응답 스키마 동일.
 */
export interface MapSetting {
  id: string;
  address: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/**
 * 지도 주소 설정 수정 본문 — 백엔드 DTO와 1:1 (정확히 address 1개 키만 전송).
 * 다른 키를 보내면 백엔드가 forbidNonWhitelisted로 400 거부한다.
 */
export interface UpdateMapSettingBody {
  address: string;
}
