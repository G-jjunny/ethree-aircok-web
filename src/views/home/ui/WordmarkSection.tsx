/**
 * 자이언트 워드마크 (시안 §8). 흰 배경, "SMART AIRCOK"(AIRCOK=brand) 대형 타이포 + 서브 슬로건.
 */
export function WordmarkSection() {
  return (
    <section className="overflow-hidden bg-surface-white py-14 text-center">
      <div
        className="font-display font-extrabold leading-[0.9] tracking-wordmark text-ink"
        /* token 없음: 워드마크 반응형 크기(clamp) — 스케일 토큰 범위 밖의 1회성 디스플레이 사이즈 */
        style={{ fontSize: 'clamp(46px, 13vw, 190px)' }}
      >
        SMART <span className="text-brand">AIRCOK</span>
      </div>
      <div className="mt-3.5 font-display text-sm tracking-wide text-muted">
        CLEAN AIR · SMART SPACE
      </div>
    </section>
  );
}
