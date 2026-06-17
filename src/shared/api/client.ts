/**
 * 공통 fetch 래퍼. entities/*\/api에서 사용한다.
 * 실제 baseURL은 shared/config의 환경변수를 사용하도록 채워나갈 것.
 */
export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}
