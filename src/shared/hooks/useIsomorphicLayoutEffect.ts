'use client';

import { useEffect, useLayoutEffect } from 'react';

/**
 * SSR 안전한 `useLayoutEffect`.
 *
 * `useLayoutEffect`는 첫 페인트 이전에 동기 실행되어 above-the-fold 깜빡임(flash)을 막지만,
 * 서버 렌더 시 React가 "useLayoutEffect does nothing on the server" 경고를 낸다.
 * 따라서 클라이언트(`typeof window !== 'undefined'`)에서는 `useLayoutEffect`,
 * 서버에서는 no-op인 `useEffect`로 폴백한다. (react-redux 등에서 쓰는 표준 패턴)
 *
 * No-JS/SSR 환경에서는 어떤 effect도 실행되지 않으므로, 서버 출력 HTML은 이 훅의 영향을 받지 않는다.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
