'use client';

import { useEffect, useState } from 'react';
import styles from './hero.module.css';

/**
 * 히어로 우측 실시간 공기질 카드 (시안 §2).
 * 정적 더미값을 setInterval 로 미세하게 흔드는 순수 UI 애니메이션(서버 데이터 아님).
 * float 부유 애니메이션은 hero.module.css.
 */
function jitter(base: number, spread: number, decimals = 0): number {
  const next = base + (Math.random() - 0.5) * spread;
  const factor = 10 ** decimals;
  return Math.round(next * factor) / factor;
}

export function HeroAqiCard() {
  const [idx, setIdx] = useState(38);
  const [pm, setPm] = useState(12);
  const [co2, setCo2] = useState(780);
  const [voc, setVoc] = useState(0.32);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx(jitter(38, 8));
      setPm(jitter(12, 6));
      setCo2(jitter(780, 60));
      setVoc(jitter(0.32, 0.1, 2));
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.float}>
      <div className="rounded-card-lg border border-white/14 bg-linear-to-b from-white/9 to-white/3 p-6 shadow-float backdrop-blur-md">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">통합 공기질 지수</span>
          <span className="inline-flex items-center gap-1.5 text-xs text-aqi-good">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-aqi-good" />
            실시간
          </span>
        </div>

        {/* 큰 지수 + 상태 */}
        <div className="mt-1.5 flex items-baseline gap-3">
          <span className="font-display text-display font-extrabold leading-none text-white">
            {idx}
          </span>
          <span className="rounded-pill bg-aqi-good/16 px-3 py-1 text-sm font-bold text-aqi-good">
            좋음
          </span>
        </div>

        {/* AQI 바 */}
        <div className="mt-4 h-1.5 rounded-full bg-linear-to-r from-aqi-good via-brand to-aqi-bad" />

        {/* 4셀 */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <AqiCell label="PM2.5 초미세먼지" value={pm} unit="㎍/㎥" status="좋음" tone="good" />
          <AqiCell label="CO₂ 이산화탄소" value={co2} unit="ppm" status="보통" tone="normal" />
          <AqiCell label="온도 · 습도" value="23.5" unit="℃ / 45%" />
          <AqiCell label="VOCs 유기화합물" value={voc} unit="ppm" status="보통" tone="normal" />
        </div>

        {/* 행동요령 */}
        <div className="mt-4 rounded-btn border border-brand/28 bg-brand/14 px-3.5 py-3 text-sm leading-normal text-brand-soft">
          💡 <b className="text-white">행동요령</b> · CO₂가 상승 중입니다. 5분간 환기를 권장합니다.
        </div>
      </div>
    </div>
  );
}

function AqiCell({
  label,
  value,
  unit,
  status,
  tone,
}: {
  label: string;
  value: string | number;
  unit: string;
  status?: string;
  tone?: 'good' | 'normal';
}) {
  return (
    <div className="rounded-btn bg-white/5 px-3.5 py-3">
      <div className="text-xs text-white/55">{label}</div>
      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className="font-display text-xl font-bold text-white">{value}</span>
        <span className="text-xs text-white/50">{unit}</span>
        {status && (
          <span
            className={`ml-auto text-xs font-bold ${tone === 'good' ? 'text-aqi-good' : 'text-aqi-normal'}`}
          >
            {status}
          </span>
        )}
      </div>
    </div>
  );
}
