import { basename, extname } from 'path';

/**
 * 업로드 파일명(originalname)을 안전한 basename 으로 정규화한다.
 *
 * 왜 latin1 -> utf8 재디코딩이 필요한가:
 *   multer 는 내부적으로 busboy 를 사용하며, busboy 는 multipart 헤더의
 *   filename 을 기본적으로 latin1 로 디코딩한다. 브라우저는 파일명을 UTF-8
 *   바이트로 전송하므로, 한글 등 비 ASCII 파일명은 UTF-8 바이트열이 latin1 로
 *   오해석된 상태(= file.originalname)로 들어온다. 이를 그대로 UTF-8 디스크에
 *   기록하면 이중 인코딩(mojibake)이 발생한다(#114).
 *   따라서 originalname 을 다시 latin1 바이트로 되돌린 뒤 UTF-8 로 디코딩해
 *   원래 문자열을 복원한다.
 */
export function decodeAndSanitizeUploadFilename(originalname: string): string {
  // 1) latin1 로 잘못 디코딩된 문자열을 원래 바이트로 되돌린 뒤 UTF-8 로 복원.
  const decoded = Buffer.from(originalname, 'latin1').toString('utf8');

  // 2) 디렉터리 성분 제거 (path traversal 1차 방어). '/', '\\' 모두 방어하기 위해
  //    basename 전에 백슬래시를 슬래시로 통일한다.
  let name = basename(decoded.replace(/\\/g, '/'));

  // 3) 남아있는 상위경로 시퀀스('..') 무해화.
  name = name.replace(/\.\./g, '_');

  // 4) 경로 구분자 / 파일시스템 위험 문자 / 제어문자(0x00~0x1F)를 '_' 로 치환.
  //    확장자 구분용 dot('.') 은 보존한다.
  // eslint-disable-next-line no-control-regex
  name = name.replace(/[\\/:*?"<>|\x00-\x1f]/g, '_');

  // 5) 앞뒤 공백 및 점 제거 (Windows 예약: 이름이 점/공백으로 끝나면 안 됨).
  name = name.replace(/^[\s.]+/, '').replace(/[\s.]+$/, '');

  // 6) 정화 후 basename 이 비면 확장자는 보존하고 base 를 'file' 로 대체.
  if (name === '') {
    const ext = extname(decoded);
    return ext ? `file${ext}` : 'file';
  }

  return name;
}
