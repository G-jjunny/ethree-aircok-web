# Design System: Aircok

> **상태: Blue-Tech 체계 확정 (이슈 #102).** Claude Design 시안(Landing + About)에서 재추출한 값이다. 모든 색상은 OKLCH.
>
> - **SSOT**: 이 문서(`docs/design.md`)
> - **구현**: `app/globals.css` 의 `@theme inline` 블록
> - **에이전트 규칙**: `.claude/skills/design-system/SKILL.md`
>
> 세 산출물의 토큰 **이름**은 항상 일치해야 한다. 값이 바뀌면 이 문서를 먼저 갱신한 뒤 `globals.css`를 수정한다.

---

## 0. 브랜드 정체성 · 방향성

**스마트에어콕(Aircok)** 은 AIoT 실내 공기질 관리 플랫폼 기업(B2B/B2G)이다. 9종 센서로 실시간 측정·진단하고 클라우드가 행동요령까지 제안한다.

**Blue-Tech 방향**: 밝은 배경(흰색 / 연회색 `surface`)과 다크 네이비 섹션(`navy`~`navy-deep`)이 교차한다. 프라이머리 블루 `brand` + 포인트 시안 `cyan`. 플랫하되 블루/블랙 글로우 그림자, pill·라운드 카드, 실시간 데이터 카드 UI가 특징. 디스플레이는 **Sora**(영문/숫자/eyebrow), 본문은 **Pretendard**(한글).

---

## 1. 사용 규칙 (필수)

- **하드코딩 금지.** `bg-[#...]` · `text-[#...]` · `rounded-[..]` · `p-[..]` · `style={{ color }}` 전부 금지. 아래 정의된 Tailwind 토큰 클래스 또는 `var(--...)` 만 사용한다.
- **불가피한 1회성 수치**만 예외로 허용하되, 값 옆에 `{/* token 없음: 이유 */}` 주석 + 보고서 `unresolvedIssues` 기재.
- **content-container 강제.** 섹션 내부 래퍼는 `content-container` 만 사용(`max-width:1240px; padding-inline:2rem`). `max-w-* mx-auto px-*` 직접 조합 금지.
- **재사용 우선.** 기존 토큰 재사용 → `shared/ui` 재사용 → 3곳 이상 반복 시 `shared/ui` 추가 → 그래도 없으면 이 문서 갱신 후 구현.

---

## 2. 색상 토큰

> 모든 값 OKLCH. 블루 계열 뉴트럴(brand/ink/surface/navy)은 `--brand-hue: 263` 파생.

### 브랜드 · 포인트 (`--brand-hue` 파생)

| 토큰 | 클래스 예 | 값 | 원본 hex | 용도 |
| --- | --- | --- | --- | --- |
| `brand` | `bg-brand` `text-brand` | `oklch(58% 0.23 263)` | `#2b6bff` | 주요 CTA·링크·강조 |
| `brand-hover` | `hover:bg-brand-hover` | `oklch(49% 0.21 263)` | `#1e4fd6` | CTA hover / 그라디언트 끝 |
| `brand-ink` | `text-brand-ink` | `oklch(100% 0 0)` | white | brand 위 텍스트(흰색) |
| `brand-soft` | `text-brand-soft` | `oklch(82% 0.09 263)` | `#a8c4ff` | 다크 위 라이트블루 텍스트/배지/링크(`#bcd2ff`·`#8ab0ff` 포함) |
| `cyan` | `text-cyan` | `oklch(71% 0.12 213)` | `#12b5cf` | 시안 포인트(다크 위 eyebrow·수치 단위) |
| `cyan-hover` | `text-cyan-hover` | `oklch(60% 0.10 213)` | `#0c8fa5` | 시안 딥 variant |

`--brand-hue: 263` 하나로 blue 계열이 함께 이동한다. CTA 그라디언트는 `from-brand to-brand-hover`.

### 텍스트 (라이트 배경)

| 토큰 | 클래스 | 값 | 원본 hex | 용도 |
| --- | --- | --- | --- | --- |
| `ink` | `text-ink` | `oklch(20% 0.037 263)` | `#0d1526` | 기본 헤딩·강본문 |
| `ink-soft` | `text-ink-soft` | `oklch(43% 0.027 263)` | `#48505f` | 카드 본문 |
| `muted` | `text-muted` | `oklch(50% 0.034 263)` | `#5a6478` | 보조 본문·설명(`#6b7488` 비활성 탭 라벨 포함) |
| `faint` | `text-faint` | `oklch(72% 0.03 263)` | `#9aa6b8` | 메타·출처·플레이스홀더 라벨(`#b3bccb` 포함) |

### 서피스 · 틴트 · 보더

| 토큰 | 클래스 | 값 | 원본 hex | 용도 |
| --- | --- | --- | --- | --- |
| `surface` | `bg-surface` | `oklch(98% 0.006 263)` | `#f5f7fb` | 연회색 섹션 배경 |
| `surface-white` | `bg-surface-white` | `oklch(100% 0 0)` | `#ffffff` | 카드·기본 흰 배경 |
| `surface-2` | `bg-surface-2` | `oklch(99% 0.004 263)` | `#f8fafd` | 비활성 탭 배경 |
| `tint` | `bg-tint` | `oklch(96% 0.017 263)` | `#eef3ff` | 아이콘 박스 연블루 tint(`#eef2f8`·`#f6f8fc` 포함) |
| `tint-border` | `border-tint-border` | `oklch(92% 0.036 263)` | `#dce6ff` | 연블루 보더 |
| `hairline` | `border-hairline` | `oklch(94% 0.01 263)` | `#e6eaf1` | 기본 hairline 보더 |

### 다크 섹션 (네이비)

| 토큰 | 클래스 | 값 | 원본 hex | 용도 |
| --- | --- | --- | --- | --- |
| `navy` | `bg-navy` | `oklch(18% 0.035 263)` | `#0a1020` | 기본 다크 섹션/헤더/트러스트 스트립 |
| `navy-deep` | `bg-navy-deep` | `oklch(14% 0.025 263)` | `#070b16` | footer / hero 끝 최암부 |
| `navy-tint` | `bg-navy-tint` | `oklch(27% 0.082 263)` | `#12224d` | 히어로 radial 상단 블루네이비(`#0e1c40` 근사) |

히어로 배경 예: `radial-gradient(120% 90% at 78% 0%, var(--color-navy-tint), var(--color-navy) 55%, var(--color-navy-deep) 100%)`.

### AQI 상태색 (공기질 지수 · 실시간 카드)

| 토큰 | 값 | 원본 hex | 용도 |
| --- | --- | --- | --- |
| `aqi-good` | `oklch(76% 0.17 155)` | `#34d17f` | 좋음(`#5fe39a`·`#7ee0a6` 근사) |
| `aqi-normal` | `oklch(75% 0.13 260)` | `#7fb0ff` | 보통 |
| `aqi-warning` | `oklch(78% 0.16 72)` | `#f5a524` | 주의 |
| `aqi-bad` | `oklch(64% 0.21 25)` | `#ef4444` | 나쁨 |

AQI 바 그라디언트: `from-aqi-good via-brand via-aqi-warning to-aqi-bad`.

### 다크 배경 위 반투명 (하드코딩 아님 — 기본 토큰 + opacity)

- 본문 강/약: `text-white/85` · `text-white/75` · `text-white/70` · `text-white/68` · `text-white/62` · `text-white/60` (시안 실측 스텝 — opacity 자유값 허용, 하드코딩 아님)
- 저대비 라벨/카피: `text-white/40` · `text-white/28`
- divider `border-white/8` · 아이콘 원 `border-white/20` · outline 버튼 `border-white/50`
- 글래스 카드(다크 위 스탯 카드): 채움 `bg-white/7` · 보더 `border-white/12` — 시안 실측값 `.07`/`.12` 유지(About STATS, 홈 실시간 카드 재사용). 문서 SSOT 는 `.07`(= `bg-white/7`) 로 확정.
- 브랜드 글로우 배경: `bg-brand/12` · `bg-brand/14` (배지·행동요령 팁), 보더 `border-brand/28` · `border-brand/40`

### 상태 (기능 토큰)

`success`(=aqi-good) · `warning`(=aqi-warning) · `error`(=aqi-bad). 관리자 삭제 버튼 등에서 사용.

---

## 3. 타이포그래피

**폰트**: 영문·숫자·eyebrow·워드마크 → `font-display`(**Sora**, layout 로드 필요) · 한글 헤딩·본문 → `font-body`(**Pretendard**, 기본 body).
**웨이트**: `font-medium`(500) / `font-semibold`(600) / `font-bold`(700) / `font-extrabold`(800). **800이 헤딩 기본.**

### 사이즈 스케일 (네이밍 토큰 — 비표준 사이즈만)

| 클래스 | px | 클래스 | px |
| --- | --- | --- | --- |
| `text-hero` | 60 | `text-h6` | 28 |
| `text-display` | 56 | `text-subtitle` | 26 |
| `text-h1` | 52 | `text-lead` | 17 |
| `text-stat` | 46 | `text-lead-sm` | 16.5 |
| `text-h2` | 44 | `text-meta` | 13.5 |
| `text-h3` | 38 | `text-eyebrow` | 12.5 |
| `text-h4` | 36 | `text-mini` | 11 |
| `text-h5` | 34 | `text-nano` | 10.5 |

**기본 유틸 재사용**: `text-7xl`(72) `text-5xl`(48) `text-2xl`(24) `text-xl`(20·22 근사) `text-lg`(18) `text-base`(16) `text-sm`(14·15 근사) `text-xs`(12).

### 트래킹 (letter-spacing)

`tracking-wordmark`(-0.03em) · `tracking-headline`(-0.02em) · `tracking-label-sm`(0.05em) · `tracking-label`(0.1em) · `tracking-caption`(0.12em) · `tracking-eyebrow`(0.14em) · `tracking-eyebrow-lg`(0.18em) · `tracking-wide`(0.4em).

한글 본문에는 음수 자간 최소화, `word-break: keep-all` 적용(body 기본). 라인 높이: 헤드라인 `1.05~1.32` · 본문 `1.5~1.8` · 숫자 `1` · 워드마크 `.9`.

---

## 4. 라운드 · 스페이싱 · 그림자 · 모션

**라운드**: `rounded-btn`(12) · `rounded-image`(18) · `rounded-card`(20) · `rounded-card-lg`(22) · `rounded-pill`(999) · `rounded-full`(9999). 16/14 는 기본 `rounded-2xl`(16)·`rounded-btn` 근사 재사용.

**스페이싱**: Tailwind 기본 4px 그리드. 섹션 수직 패딩 `py-24`(96, 기본) / `py-20`(80) / `py-28`(112).
> ⚠️ `globals.css`에 구 커스텀 스케일 `--spacing-5~10`(5=24, 6=32 …)이 회귀 방지를 위해 남아 있다(`p-5`~`p-10` 사용처 재조정 후 제거 대상). 신규 작업은 순수 기본 그리드를 쓴다.

**그림자 (블루/블랙 글로우)**: `shadow-brand-sm`(헤더 pill) · `shadow-brand`(히어로/플랫폼 CTA) · `shadow-soft`(CTA 흰 버튼) · `shadow-float`(히어로 플로팅 카드) · `shadow-card`(관리자 패널 카드).

**모션**: `duration-fast`(200ms, 커스텀 유틸리티) · `ease-out`(`cubic-bezier(0.16,1,0.3,1)`).

**Aspect(매거진 레이아웃, 기능 토큰)**: `aspect-featured`(16/7) · `aspect-card`(16/10, 뉴스 목록 카드 썸네일) · `aspect-row-thumb`(4/3).

**줄무늬 플레이스홀더(이미지 자산 폴백, 유틸)**: `stripes-surface`(회색계) · `stripes-tint`(연블루계) · `stripes-dark`(네이비 섹션 위 흰색 반투명 라인). `-45deg` 대각선 repeating-linear-gradient — 각도·줄 간격은 패턴 정의 자체(하드코딩 아님, marquee `translateX(-50%)` 와 동일 취급). 공용 컴포넌트 `<PagePlaceholder>`가 세 톤을 감싸며, 모든 이미지 자산 미확보 자리(뉴스 coverImage 폴백·About 이미지 자리 등)의 **단일 표준**이다.

**content-container**: `max-width:1240px; margin-inline:auto; padding-inline:2rem`.

**reading 칼럼**: `max-w-reading`(=`--container-reading` 47.5rem/760px). 뉴스 상세 article·PageHero 텍스트 칼럼 등 좁은 읽기 폭. content-container 내부에서 `mx-auto max-w-reading` 로 조합.

---

## 5. 공용 컴포넌트 우선

작업 전 `src/shared/ui/index.ts` 확인. 동일 역할 마크업 중복 금지. 반복 패턴 3곳 이상이면 `shared/ui`에 추가 후 `index.ts` export.

**구현됨 (이슈 #102 Pre)**:

- `<Button variant="primary|dark|outline|white" size="sm|md" pill? asChild?>` — primary=히어로/헤더 CTA(그라디언트 `from-brand to-brand-hover`), dark=라이트 섹션 보조 CTA(`bg-navy`), outline=다크/컬러 배경 위 보조(`border-white/50`), white=CTA 컬러 섹션 흰 버튼(`shadow-soft`). `pill`=헤더 도입문의(rounded-pill), 기본 rounded-btn. `asChild`로 Next `<Link>` CTA 렌더. md=44px 터치타겟, primary만 글로우 그림자(sm=`shadow-brand-sm`/md=`shadow-brand`).
- `<SectionLabel color="brand|cyan" size="md|sm" as?>` — eyebrow. Sora(`font-display`)·uppercase·600. md=`text-eyebrow tracking-eyebrow-lg`(섹션), sm=`text-mini tracking-eyebrow`(카드). ⚠️ eyebrow 남용 금지: 섹션 3개당 1개 이하.

**구현됨 (이슈 #111 Pre)**:

- `<PagePlaceholder variant="surface|tint|dark" label? rounded? bordered? className? children?>` — 이미지 자산 미확보 자리의 표준 줄무늬 블록. `variant`가 §4 `stripes-*` 유틸(surface=회색계·tint=연블루계·dark=네이비 위 흰 반투명)과 보더(`border-hairline`/`border-tint-border`/`border-white/8`)·라벨 톤(`text-faint`/`text-white/40`)을 함께 전환. 라벨은 `font-display text-mini font-semibold uppercase tracking-eyebrow`(Sora eyebrow) 표준. 라운드는 `rounded` prop(기본 `rounded-card`)으로, 크기·비율은 `className`으로 주입. 뉴스 coverImage 폴백·About 이미지 자리 등 **모든 플레이스홀더의 단일 소스**.

**후속 Pre 후보(3곳 이상 반복 판단 후)**: `<StatCard>`·`<AqiCard>`·`<PartnerMarquee>` 등.

---

## 6. 구 토큰 → 신 토큰 (deprecated, 마이그레이션 대상)

`globals.css`에는 빌드 무결성을 위해 구 토큰이 신 토큰을 가리키는 **임시 별칭(deprecated alias)** 으로 남아 있다. 신규 작업에는 **신 토큰만** 사용한다. 컴포넌트 마이그레이션 완료 후 별칭 블록은 통째로 제거된다.

| 구 토큰 | → 신 토큰 |
| --- | --- |
| `aircok-blue` | `brand` |
| `aircok-blue-dark` | `brand-hover` |
| `aircok-blue-light` | `cyan` (구 lime→cyan) |
| `olive` / `olive-label` | `brand` |
| `olive-soft` | `brand-soft` |
| `olive-muted` | `muted` |
| `accent` | `cyan` (구 lime→cyan) |
| `surface-light` | `surface` |
| `surface-dark` / `surface-dark-1` / `surface-stat*` | `navy` (+ opacity) |
| `surface-dark-2` | `navy-deep` |
| `heading-dark` | `ink` |
| `body-dark` | `ink-soft` |
| `secondary-dark` | `muted` |
| `heading-light` | `surface-white` / `text-white` |
| `body-light` | `text-white/80` |
| `link-on-light` / `focus` | `brand` |
| `link-on-dark` | `brand-soft` |
| `border-light` / `border-subtle` | `hairline` |
| `border-dark` | `border-white/8` |
| `rounded-sm/md` | `rounded-btn` |
| `rounded-lg` | `rounded-image` |
| `rounded-xl` | `rounded-card` |
| `rounded-pill` (구 28px) | 값이 999px(full pill)로 변경됨 — 자동 반영 |
| `shadow-product` | `shadow-float` |
| `text-nav` (15) | `text-sm` |
| `text-subheading` (21) | `text-xl` / `text-subtitle` |

**유지(기능 토큰, 마이그레이션 대상 아님)**: `nav-bg*`, `overlay-*`, `aspect-featured`, `aspect-row-thumb`, `animate-marquee-*`, `success/warning/error`, `shadow-card`.

> 구 올리브/크림/라임 방향 컴포넌트 명세는 이전 문서에서 이미 제거됐다. Blue-Tech 컴포넌트 명세(Hero·AQI Card·Trust Strip·Tabs·4-Step·Our Value·Platform·Wordmark·Clients·CTA·Footer)는 홈페이지/About 마이그레이션과 함께 재문서화한다. 그 전까지는 위 대응표로 구 토큰 사용처를 신 토큰으로 옮긴다.
