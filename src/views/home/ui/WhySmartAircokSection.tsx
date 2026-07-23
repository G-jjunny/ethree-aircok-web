'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SITE } from '@/shared/config';
import { SectionLabel, ScrollReveal } from '@/shared/ui';

const TABS = [
  {
    num: '01',
    en: 'CONCENTRATION',
    kr: '직원 생산성',
    metrics: [
      { value: '50%', label: '집중력 향상' },
      { value: '35%↓', label: '병가 감소' },
      { value: '$15,500', label: '초과 성과' },
    ],
  },
  {
    num: '02',
    en: 'VALUE',
    kr: '소유빌딩 가치',
    metrics: [
      { value: '25%↑', label: '건물 가치' },
      { value: '+$32', label: '㎡당 임대료' },
    ],
  },
  {
    num: '03',
    en: 'COST',
    kr: '에너지 비용',
    metrics: [
      { value: '10~30%', label: '관리비 개선' },
      { value: '79%', label: '최대 절감' },
    ],
  },
  {
    num: '04',
    en: 'AIR QUALITY',
    kr: '공기질 개선',
    metrics: [{ value: '16~46%', label: '공기질 개선' }],
  },
];

/**
 * WHY SMART AIRCOK / 탭 4종 (시안 §4). 연회색 배경, eyebrow + h2, 탭 바(4) +
 * 활성 패널(좌: 지표, 우: 설명·출처). 탭 상태는 로컬 useState(순수 UI).
 */
export function WhySmartAircokSection() {
  const [active, setActive] = useState(0);
  const stat = SITE.stats[active];
  const tab = TABS[active];

  return (
    <section className="bg-surface py-24">
      <div className="content-container">
        {/* token 없음: max-w-[820px] — 인트로 프로즈 컬럼 너비. 프로즈 폭은 값이 매번 달라(500·640·720·760·820) 단일 토큰화 대상 아님, 코드베이스 공통 1회성 수치 규약 준수 */}
        <ScrollReveal variant="fade-up" className="mx-auto max-w-[820px] text-center">
          <SectionLabel color="brand">WHY SMART AIRCOK</SectionLabel>
          <h2 className="mt-4 text-h2 font-extrabold leading-snug tracking-headline text-ink">
            미세먼지 심한데 공조기 작동 잘 되는지 궁금하다면?
            <br />
            <span className="text-brand">스마트에어콕</span>을 만나보세요
          </h2>
          <p className="mt-5 text-lead-sm leading-relaxed text-muted">
            스마트 에어콕은 실내 공기질 관리로 근무자의 생산성 향상과 기업 가치를 높입니다.
          </p>
        </ScrollReveal>

        <ScrollReveal variant="fade-up" delay={80}>
        {/* 탭 바 (연결형 · 상단만 라운드) — 모바일은 2×2 그리드로 4탭 전부 노출(가로 스크롤·잘림 금지),
            gap-px + bg-hairline 로 셀 사이 1px 구분선(연결형 유지). 데스크탑(≥sm)은 기존과 동일하게
            flex-1 균등 4탭 + 영문/한글 2줄 라벨 복원 */}
        <div
          role="tablist"
          aria-label="스마트에어콕 도입 효과"
          className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-t-card border border-hairline bg-hairline sm:flex sm:gap-0 sm:bg-transparent"
        >
          {TABS.map((t, i) => {
            const isActive = i === active;
            return (
              <button
                key={t.num}
                type="button"
                role="tab"
                id={`why-tab-${i}`}
                aria-selected={isActive}
                aria-controls={`why-panel-${i}`}
                onClick={() => setActive(i)}
                className={`flex items-center justify-center gap-2 border-b-2 px-2 py-4 text-left transition-colors duration-fast sm:flex-1 sm:justify-start sm:gap-3 sm:whitespace-nowrap sm:px-4 ${
                  isActive
                    ? 'border-brand bg-surface-white'
                    : 'border-transparent bg-surface-2 hover:bg-surface-white/60'
                }`}
              >
                <span
                  className={`flex size-6 items-center justify-center rounded-btn font-display font-extrabold ${
                    isActive ? 'bg-brand text-white' : 'bg-tint text-brand'
                  }`}
                >
                  {t.num}
                </span>
                <span className="flex flex-col">
                  <span
                    className={`hidden font-display text-nano tracking-eyebrow sm:block ${
                      isActive ? 'text-brand' : 'text-muted'
                    }`}
                  >
                    {t.en}
                  </span>
                  <span className={`text-sm font-bold [word-break:keep-all] sm:text-base ${isActive ? 'text-ink' : 'text-muted'}`}>
                    {t.kr}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* 활성 패널 (탭 바와 이어붙임 · 하단만 라운드) */}
        <div
          role="tabpanel"
          id={`why-panel-${active}`}
          aria-labelledby={`why-tab-${active}`}
          className="rounded-b-card border border-t-0 border-hairline bg-surface-white p-5 sm:p-7"
        >
          <div className="grid items-center gap-8 md:gap-13 md:grid-cols-[0.85fr_1.15fr]">
            {/* 좌: eyebrow + 제목 + 지표 */}
            <div>
              <SectionLabel color="brand" size="sm">
                {tab.en}
              </SectionLabel>
              <h3 className="mt-3 text-subtitle font-extrabold text-ink">{stat.title}</h3>
              <div className="mt-5 flex flex-wrap gap-6">
                {tab.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="font-display text-h3 font-extrabold text-brand">
                      {m.value}
                    </div>
                    <div className="mt-1 text-meta text-muted">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* 우: 설명·출처 */}
            <div>
              <p className="text-base leading-relaxed text-ink-soft">{stat.description}</p>
              <p className="mt-4 border-l-2 border-hairline pl-3.5 text-meta text-faint">
                출처 · {stat.source}
              </p>
            </div>
          </div>
        </div>
        </ScrollReveal>

        {/* 하단 링크 */}
        <div className="mt-6 text-center">
          <Link
            href={SITE.statsCta.href}
            className="font-display text-eyebrow tracking-eyebrow text-muted"
          >
            SEE ALL OUR SERVICES <span className="text-brand">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
