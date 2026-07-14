'use client';

import { useEffect, useState } from 'react';

/**
 * 값의 변경을 지정한 지연(ms) 이후에만 반영하는 디바운스 훅.
 * 빠르게 바뀌는 입력(검색어 등)을 서버 요청·URL 동기화에 그대로 흘려보내지 않도록 완충한다.
 *
 * @param value 원본 값(즉시 바뀜)
 * @param delay 디바운스 지연(ms). 기본 300ms
 * @returns delay 동안 값이 안정되면 반영되는 디바운스된 값
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
