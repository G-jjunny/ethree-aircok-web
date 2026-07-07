import localFont from 'next/font/local';

/**
 * Pretendard 가변 폰트(self-host).
 * 기존 jsdelivr CDN @import(render-blocking)를 대체한다. 단일 variable woff2 하나로
 * 400/500/600/700 등 실제 사용 weight를 모두 커버한다(weight 45~920).
 * CSS 변수 `--font-pretendard`를 노출하고, globals.css의 --font-display/--font-body가
 * 이 변수를 참조한다. display: 'swap'으로 폰트 로드 중 텍스트 표시(FOIT 방지).
 */
export const pretendard = localFont({
  src: './PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
  weight: '45 920',
  preload: true,
  fallback: [
    'SF Pro Text',
    '-apple-system',
    'BlinkMacSystemFont',
    'system-ui',
    'Helvetica Neue',
    'sans-serif',
  ],
});
