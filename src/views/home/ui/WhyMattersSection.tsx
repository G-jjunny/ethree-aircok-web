'use client';

import { useState } from 'react';
import { SITE } from '@/shared/config';
import { SectionLabel } from '@/shared/ui';

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
export function WhyMattersSection() {
  const [active, setActive] = useState(0);
  const stat = SITE.stats[active];
  const tab = TABS[active];

  return (
    <section className="bg-surface py-24">
      <div className="content-container">
        <div className="mx-auto max-w-[820px] text-center">
          <SectionLabel color="brand">WHY SMART AIRCOK</SectionLabel>
          <h2 className="mt-4 text-h4 font-extrabold leading-snug tracking-headline text-ink">
            미세먼지 심한데 공조기 작동 잘 되는지 궁금하다면?
            <br />
            <span className="text-brand">스마트에어콕</span>을 만나보세요
          </h2>
          <p className="mt-5 text-lead-sm leading-relaxed text-muted">
            스마트 에어콕은 실내 공기질 관리로 근무자의 생산성 향상과 기업 가치를 높입니다.
          </p>
        </div>

        {/* 탭 바 */}
        <div
          role="tablist"
          aria-label="스마트에어콕 도입 효과"
          className="mt-12 grid grid-cols-2 gap-2 rounded-2xl bg-surface-2 p-2 md:grid-cols-4"
        >
          {TABS.map((t, i) => {
            const isActive = i === active;
            return (
              <button
                key={t.num}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(i)}
                className={`flex flex-col items-start gap-1 rounded-btn border-b-2 px-4 py-3 text-left transition-colors duration-fast ${
                  isActive
                    ? 'border-brand bg-surface-white'
                    : 'border-transparent hover:bg-surface-white/60'
                }`}
              >
                <span className="font-display text-nano tracking-eyebrow text-muted">
                  {t.num} {t.en}
                </span>
                <span
                  className={`text-sm font-bold ${isActive ? 'text-ink' : 'text-muted'}`}
                >
                  {t.kr}
                </span>
              </button>
            );
          })}
        </div>

        {/* 활성 패널 */}
        <div className="mt-6 grid gap-6 rounded-2xl border border-hairline bg-surface-white p-6 md:grid-cols-[0.9fr_1.1fr]">
          {/* 좌: 지표 */}
          <div className="flex flex-wrap gap-6">
            {tab.metrics.map((m) => (
              <div key={m.label}>
                <div className="font-display text-h3 font-extrabold text-brand">{m.value}</div>
                <div className="mt-1 text-sm text-muted">{m.label}</div>
              </div>
            ))}
          </div>
          {/* 우: 설명·출처 */}
          <div>
            <h3 className="text-subtitle font-bold text-ink">{stat.title}</h3>
            <p className="mt-3 text-base leading-relaxed text-ink-soft">{stat.description}</p>
            <p className="mt-4 text-meta text-faint">출처 · {stat.source}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
