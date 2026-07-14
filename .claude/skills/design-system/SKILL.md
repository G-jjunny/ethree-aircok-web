---
name: design-system
description: 이 프로젝트의 디자인 토큰 규칙. 마크업/className 작업 시 자동 로드.
---

# 토큰 사용 규칙 (Blue-Tech 체계)

SSOT: `docs/design.md` · 구현: `app/globals.css @theme inline` · 공용 컴포넌트: `src/shared/ui/index.ts`.
**하드코딩 절대 금지.** `bg-[#...]` `text-[#...]` `p-[..]` `rounded-[..]` `style={{color}}` 전부 금지.
불가피하면 값 옆에 `{/* token 없음: 이유 */}` 주석 + 보고서 unresolvedIssues 기재.

방향: 밝은 배경(흰색/연회색) + 다크 네이비 섹션 교차. 프라이머리 블루 `brand` + 포인트 시안 `cyan`.

## 언제 무슨 클래스를 쓰나

### 색상

- 연회색 섹션 배경: `bg-surface` · 카드/흰 배경: `bg-surface-white` · 비활성 탭: `bg-surface-2`
- 다크 섹션 배경: `bg-navy` · 최암부(footer/hero 끝): `bg-navy-deep` · 히어로 상단 블루네이비: `bg-navy-tint`
- 라이트 배경 헤딩/본문: `text-ink` · 카드 본문: `text-ink-soft` · 보조: `text-muted` · 메타/출처: `text-faint`
- 주요 CTA: `bg-brand text-brand-ink hover:bg-brand-hover` (그라디언트는 `from-brand to-brand-hover`)
- 포인트(다크 위 eyebrow·수치 단위): `text-cyan`
- 다크 위 라이트블루 텍스트/배지/링크: `text-brand-soft`
- 아이콘 박스 연블루: `bg-tint` + `border-tint-border`
- 라이트 hairline 보더: `border-hairline`
- AQI 상태: `text-aqi-good` / `text-aqi-normal` / `text-aqi-warning` / `text-aqi-bad`

### 다크 배경 위 반투명 (하드코딩 아님 — 기본 토큰 + opacity)

- 본문 강/약: `text-white/85` · `text-white/70` · `text-white/68` · `text-white/62` · `text-white/60` (시안 실측 스텝, opacity 자유값 허용)
- 저대비 라벨: `text-white/40`
- divider: `border-white/8` · 아이콘 원: `border-white/20` · outline 버튼: `border-white/50`
- 다크 위 글래스 카드: 채움 `bg-white/7` · 보더 `border-white/12` (시안 실측 .07/.12)
- 브랜드 글로우 배지/팁: `bg-brand/12` `border-brand/40`

### 타이포

- 폰트: 영문/숫자/eyebrow/워드마크 → `font-display`(Sora), 한글 헤딩·본문 → `font-body`(Pretendard, 기본)
- 사이즈(네이밍 토큰): `text-hero`(60) `text-display`(56) `text-h1`(52) `text-stat`(46) `text-h2`(44)
  `text-h3`(38) `text-h4`(36) `text-h5`(34) `text-h6`(28) `text-subtitle`(26) `text-lead`(17)
  `text-lead-sm`(16.5) `text-meta`(13.5) `text-eyebrow`(12.5) `text-mini`(11) `text-nano`(10.5)
- 기본 유틸 재사용: `text-7xl`(72) `text-5xl`(48) `text-2xl`(24) `text-xl`(20) `text-lg`(18) `text-base`(16) `text-sm`(14) `text-xs`(12)
- 웨이트: `font-medium/semibold/bold/extrabold` (헤딩 기본 800)
- 트래킹: `tracking-wordmark`(-.03) `tracking-headline`(-.02) `tracking-label-sm`(.05) `tracking-label`(.1)
  `tracking-caption`(.12) `tracking-eyebrow`(.14) `tracking-eyebrow-lg`(.18) `tracking-wide`(.4)

### 라운드 / 스페이싱 / 그림자 / 모션

- 라운드: `rounded-btn`(12) `rounded-image`(18) `rounded-card`(20) `rounded-card-lg`(22) `rounded-pill`(999) `rounded-full`
- 스페이싱: Tailwind 기본 4px 그리드. 섹션 수직 `py-24`(96)/`py-20`(80)/`py-28`(112)
- 그림자: `shadow-brand-sm` `shadow-brand` `shadow-soft` `shadow-float` `shadow-card`(관리자)
- 모션: `duration-fast`(200ms) `ease-out`

### content-container (강제)

섹션 내부 래퍼는 `content-container`만 사용(max-width 1240 / padding 32). `max-w-* mx-auto px-*` 직접 금지. 좁은 읽기 칼럼(뉴스 상세 article 등)은 `mx-auto max-w-reading`(760px 토큰) 사용, `max-w-[760px]` 금지.

### Aspect / 플레이스홀더 (뉴스)

- Aspect: `aspect-featured`(16/7) `aspect-card`(16/10, 목록 카드 썸네일) `aspect-row-thumb`(4/3). `aspect-[..]` 하드코딩 금지.
- coverImage 폴백 줄무늬: `stripes-surface`(회색계) / `stripes-tint`(연블루계). 인라인 repeating-linear-gradient 하드코딩 금지.

## 구 토큰은 쓰지 않는다 (deprecated)

`aircok-blue`→`brand` · `aircok-blue-light`/`accent`→`cyan` · `olive*`→`brand`/`brand-soft` · `surface-dark*`→`navy` · `heading-dark`→`ink` · `body-dark`→`ink-soft` · `secondary-dark`→`muted` · `border-light/subtle`→`hairline` · `text-nav`→`text-sm` · `text-subheading`→`text-xl`. 신규 작업엔 신 토큰만.

## 공용 컴포넌트 우선

작업 전 `src/shared/ui/index.ts` 확인. 동일 역할 마크업 중복 금지.
반복 패턴 3곳 이상이면 shared/ui에 추가 후 index.ts export.

## 재사용 우선 순서

기존 토큰 재사용 → shared/ui 재사용 → 3곳 이상 반복 시 shared/ui 추가 → 그래도 없으면 design.md 갱신 후 구현.
변경의 기본값은 "추가"가 아니라 "재사용".
