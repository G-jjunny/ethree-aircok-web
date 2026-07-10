'use client';

import { useEffect, useRef } from 'react';

/**
 * 히어로 배경 영상 (장식). autoPlay/muted/loop 로 재생하되,
 * prefers-reduced-motion: reduce 사용자에겐 재생을 멈춘다(matchMedia).
 * 히어로 드리프트 글로우(hero.module.css)의 reduced-motion 대응과 일관.
 */
export function HeroBackgroundVideo({ className }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      if (mq.matches) {
        video.pause();
      } else {
        void video.play().catch(() => {});
      }
    };

    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return (
    <video
      ref={ref}
      aria-hidden
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className={className}
    >
      <source src="/images/home/hero_bg.mp4" type="video/mp4" />
    </video>
  );
}
