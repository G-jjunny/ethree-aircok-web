# Design System: Aircok

> **상태: 구조 재설정 중 (이슈 #100).** 토큰 **이름 구조**는 확정이나, 색상 등 **값은 잠정(placeholder)** 이며 시안 확정 후 교체한다. `TBD` 표기된 값은 임시값이다.
>
> - **SSOT**: 이 문서(`docs/design.md`)
> - **구현**: `app/globals.css` 의 `@theme inline` 블록
> - **에이전트 규칙**: `.claude/skills/design-system/SKILL.md`
>
> 세 산출물의 토큰 **이름**은 항상 일치해야 한다. 값이 바뀌면 이 문서를 먼저 갱신한 뒤 `globals.css`를 수정한다.

---

## 0. 브랜드 정체성

**스마트에어콕(Aircok)** 은 스마트 공기질 제어 솔루션 기업(B2B/B2G)이다. "공기(Air)"와 "코크(Cock, 밸브)"의 결합처럼 깨끗하고 정밀하게 제어되는 공기 환경이 핵심 가치.

**톤**: 신뢰감(안정적), 청결함(여백·화이트 스페이스), 정밀함(제품 중심), 한국어 가독성 우선.

---

## 1. 사용 규칙 (필수)

- **하드코딩 금지.** `bg-[#...]` · `text-[#...]` · `rounded-[..]` · `p-[..]` · `style={{ color }}` 전부 금지. 아래 정의된 Tailwind 토큰 클래스 또는 `var(--...)` 만 사용한다.
- **불가피한 1회성 수치**만 예외로 허용하되, 값 옆에 `{/* token 없음: 이유 */}` 주석 + 보고서 `unresolvedIssues` 기재.
- **content-container 강제.** 섹션 내부 래퍼는 `content-container` 만 사용. `max-w-* mx-auto px-*` 직접 조합 금지.
- **재사용 우선.** 기존 토큰 재사용 → `shared/ui` 재사용 → 3곳 이상 반복 시 `shared/ui` 추가 → 그래도 없으면 이 문서 갱신 후 구현.

---

## 2. 색상 토큰

> 모든 값 OKLCH · **잠정(TBD)**. 시안 확정 후 교체.

### 브랜드 (`--brand-hue` 파생 아키텍처)

| 토큰 | 클래스 예 | 값(잠정) | 용도 |
| --- | --- | --- | --- |
| `brand` | `bg-brand` `text-brand` | `oklch(55% 0.24 var(--brand-hue))` | 주요 CTA·인터랙티브 |
| `brand-hover` | `hover:bg-brand-hover` | `oklch(47% 0.22 var(--brand-hue))` | CTA hover |
| `brand-ink` | `text-brand-ink` | `oklch(100% 0 0)` | brand 위 텍스트(흰색) |

`--brand-hue: 263` (TBD) 하나로 brand 계열을 파생한다. 휴가 바뀌면 계열 전체가 함께 이동한다.

### 텍스트 (라이트 배경)

| 토큰 | 클래스 | 값(잠정) | 용도 |
| --- | --- | --- | --- |
| `ink` | `text-ink` / `bg-ink` | `oklch(22% 0.005 270)` | 헤딩·강본문 / 다크 섹션 배경 겸용 |
| `ink-soft` | `text-ink-soft` | `oklch(40% 0.01 270)` | 보조 본문 |
| `muted` | `text-muted` | `oklch(56% 0.01 270)` | 메타·날짜·캡션 |

### 서피스

| 토큰 | 클래스 | 값(잠정) | 용도 |
| --- | --- | --- | --- |
| `surface` | `bg-surface` | `oklch(97% 0.008 95)` | 페이지 배경(크림) · body 기본값 |
| `surface-white` | `bg-surface-white` | `oklch(100% 0 0)` | 카드 배경(흰색) |

### 올리브 (밴드 / eyebrow)

| 토큰 | 클래스 | 값(잠정) | 용도 |
| --- | --- | --- | --- |
| `olive` | `bg-olive` | `oklch(44% 0.06 128)` | 올리브 밴드 배경 |
| `olive-label` | `text-olive-label` | `oklch(52% 0.08 128)` | 라이트 위 eyebrow |
| `olive-soft` | `text-olive-soft` | `oklch(82% 0.04 128)` | 올리브 위 eyebrow |
| `olive-muted` | `text-olive-muted` | `oklch(64% 0.06 128)` | 카드 번호 |

### 포인트 · 보조

| 토큰 | 클래스 | 값(잠정) | 용도 |
| --- | --- | --- | --- |
| `accent` | `text-accent` | `oklch(87% 0.19 125)` | 다크 배경 위 라임 포인트 |
| `tint` | `bg-tint` | `oklch(94% 0.05 128)` | 아이콘 배경(연녹) |
| `hairline` | `border-hairline` | `oklch(22% 0.005 270 / 0.08)` | 라이트 hairline 보더 |

### 다크/올리브 배경 위 반투명 (하드코딩 아님 — 기본 토큰 + opacity)

- 본문 강/약: `text-white/80` · `text-white/70`
- 저대비 라벨: `text-white/40`
- divider `border-white/12` · 아이콘 원 `border-white/20` · outline 버튼 `border-white/40`

### 상태 (기능 토큰)

`success` `oklch(72% 0.19 145)` · `warning` `oklch(78% 0.16 68)` · `error` `oklch(64% 0.23 25)` — 모두 TBD.

---

## 3. 타이포그래피

**폰트**: 영문·숫자·eyebrow → `font-display`(Manrope, TBD 로드 필요) · 한글 본문 → `font-body`(Pretendard).
**웨이트**: `font-medium` / `font-bold` / `font-extrabold` / `font-black`.

### 사이즈 스케일 (네이밍 토큰 · 값 잠정)

| 클래스 | px | 클래스 | px |
| --- | --- | --- | --- |
| `text-mega` | 72 | `text-lead` | 17 |
| `text-hero` | 64 | `text-list` | 15.5 |
| `text-h1` | 38 | `text-body-sm` | 15 |
| `text-h2` | 36 | `text-detail` | 14.5 |
| `text-h3` | 28 | `text-meta` | 13.5 |
| `text-logo` | 26 | `text-eyebrow` | 13 |
| `text-item` | 19 | `text-caption` | 12.5 |
|  |  | `text-mini` | 11 |

기본 유틸 그대로 사용: `text-2xl`(24) `text-xl`(20) `text-base`(16) `text-sm`(14) `text-xs`(12).

### 트래킹 (letter-spacing)

`tracking-headline`(-0.01em) · `tracking-caption`(0.1em) · `tracking-label`(0.14em) · `tracking-eyebrow`(0.2em) · `tracking-hero`(0.22em).

한글 본문에는 음수 자간 최소화, `word-break: keep-all` 적용(body 기본).

---

## 4. 라운드 · 스페이싱 · 모션

**라운드**: `rounded-card`(4) · `rounded-image`(8) · `rounded-pill`(28) · `rounded-full`(9999).

**스페이싱**: Tailwind 기본 4px 그리드. 섹션 수직 리듬 `py-30`(120) / `py-25`(100) / `py-20`(80).
> ⚠️ 잠정: `globals.css`에 구 커스텀 스케일 `--spacing-5~10`(5=24, 6=32 …)이 회귀 방지를 위해 남아 있다. 신 체계는 순수 기본 그리드이므로, 사용처 재조정 후 override를 제거해야 한다.

**모션**: `duration-fast`(150ms, 커스텀 유틸리티) · `ease-out`(`cubic-bezier(0.16,1,0.3,1)`). **그림자 토큰 없음 — 플랫 디자인.**

**Aspect(매거진 레이아웃, 기능 토큰)**: `aspect-featured`(16/7) · `aspect-row-thumb`(4/3).

**content-container**: `max-width:1200px; margin-inline:auto; padding-inline:1.25rem`.

---

## 5. 공용 컴포넌트 우선

작업 전 `src/shared/ui/index.ts` 확인. 동일 역할 마크업 중복 금지. 반복 패턴 3곳 이상이면 `shared/ui`에 추가 후 `index.ts` export.

---

## 6. 구 토큰 → 신 토큰 (deprecated, 마이그레이션 대상)

`globals.css`에는 빌드 무결성을 위해 구 토큰이 신 토큰을 가리키는 **임시 별칭(deprecated alias)** 으로 남아 있다. 신규 작업에는 **신 토큰만** 사용한다. 컴포넌트 마이그레이션 완료 후 별칭 블록은 통째로 제거된다.

| 구 토큰 | → 신 토큰 |
| --- | --- |
| `aircok-blue` | `brand` |
| `aircok-blue-dark` | `brand-hover` |
| `aircok-blue-light` | `accent` (blue→lime) |
| `surface-light` | `surface` |
| `surface-dark` / `surface-dark-1/2` / `surface-stat*` | `ink` (+ opacity) |
| `heading-dark` | `ink` |
| `body-dark` | `ink-soft` |
| `secondary-dark` | `muted` |
| `heading-light` | `surface-white` / `text-white` |
| `body-light` | `text-white/80` |
| `link-on-light` / `focus` | `brand` |
| `link-on-dark` | `accent` |
| `border-light` / `border-subtle` | `hairline` |
| `border-dark` | `border-white/12` |
| `rounded-sm/md/lg/xl` | `rounded-card` / `rounded-image` |
| `rounded-pill` (구 980 full) | `rounded-full` |
| `shadow-card` / `shadow-product` | 없음(플랫 — 제거) |
| `text-nav` (15) | `text-body-sm` |
| `text-subheading` (21) | `text-item` / `text-h3` |

**유지(기능 토큰, 마이그레이션 대상 아님)**: `nav-bg*`, `overlay-*`, `aspect-featured`, `aspect-row-thumb`, `animate-marquee-*`, `success/warning/error`.

> 기존 컴포넌트 패턴 명세(Hero·Feature Strip·Stat Card·News·Footer 등)는 이전 Apple/블루 방향을 기준으로 작성돼 있어 이번 구조 재설정에서 이 문서에서 제거했다. 신 방향(올리브/오가닉) 컴포넌트 명세는 시안 확정 후 마이그레이션과 함께 재문서화한다. 그 전까지는 위 대응표로 구 토큰 사용처를 신 토큰으로 옮긴다.
