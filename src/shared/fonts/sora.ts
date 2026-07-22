import { Sora } from 'next/font/google';

/**
 * Sora — 디스플레이 폰트(영문/숫자/eyebrow/워드마크).
 * Blue-Tech 시안의 `font-family:'Sora'` 매핑. next/font/google 로 self-host 하며
 * CSS 변수 `--font-sora`를 노출한다. globals.css 의 `--font-display` 가 이 변수를
 * 참조하도록 design(Polish)에서 갱신해야 실제 Sora 가 적용된다(현재 리터럴 'Sora').
 * display:'swap' 으로 로드 중 텍스트 표시(FOIT 방지).
 */
export const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sora',
  display: 'swap',
});
