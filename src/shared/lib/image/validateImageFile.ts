/**
 * 업로드 이미지의 **클라이언트 사전 검증** — 백엔드 업로드 제약을 그대로 미러링한다.
 *
 * 대상 엔드포인트: POST /air-devices/:id/image · PUT /product-images/:slot
 * (둘 다 MIME image/png|jpeg|webp|gif, 최대 5MB. 위반 시 400)
 *
 * 도메인 무관한 "파일 제약 메커니즘"이므로 shared에 둔다 — 서버가 최종 판정자이며,
 * 이 함수는 불필요한 왕복을 줄이기 위한 1차 방어일 뿐이다. 호출부는 이 검증과 별개로
 * 서버 에러 메시지를 `extractUploadError`로 반드시 노출한다.
 */

/** 백엔드 FileTypeValidator가 허용하는 MIME 목록. */
export const ACCEPTED_IMAGE_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
] as const;

/** 백엔드 MaxFileSizeValidator 상한(5MB). */
export const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024;

/** `<input type="file">`의 accept 속성 값. 허용 MIME 목록과 단일 출처를 공유한다. */
export const IMAGE_FILE_ACCEPT = ACCEPTED_IMAGE_MIME_TYPES.join(',');

/**
 * 업로드 가능한 이미지인지 검사한다.
 * @returns 위반 시 사용자에게 보여줄 메시지, 통과 시 null.
 */
export function validateImageFile(file: File): string | null {
  if (!(ACCEPTED_IMAGE_MIME_TYPES as readonly string[]).includes(file.type)) {
    return 'PNG · JPEG · WEBP · GIF 이미지만 업로드할 수 있습니다';
  }
  if (file.size > MAX_IMAGE_FILE_SIZE) {
    return `이미지 용량은 ${MAX_IMAGE_FILE_SIZE / 1024 / 1024}MB를 넘을 수 없습니다`;
  }
  return null;
}
