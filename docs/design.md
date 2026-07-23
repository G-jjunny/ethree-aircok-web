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

**서브브랜드 — AIR CHEF(에어셰프)**: 주방·조리실 공기질 개선 제품 계열. Blue-Tech 의 청록 대응 계열(`chef`, §2)로, 딥그린 다크 섹션 + 연청록 카드가 특징. 시스템 골격(타이포·라운드·스페이싱·그림자)은 Blue-Tech 와 100% 공유하고 **색상 계열만 분기**한다.

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

### AIR CHEF · 주방 계열 (`--chef-hue: 181` 파생)

**에어셰프(AIR CHEF)** 는 **주방·조리실 공기질 개선 제품 브랜드 계열**이다. 청록(teal)으로 실내 공기질(스마트 에어콕, blue) 계열과 구분한다. `--brand-hue` 와 동일한 파생 구조를 미러링한다.

> ⚠️ **계열 분리 원칙.** chef 계열은 **`/services` 주방(AIR CHEF) 탭 내부에서만** 사용한다. 실내 공기질(스마트 에어콕) 섹션·공용 CTA·헤더/푸터는 `brand`/`cyan`/`navy` 를 그대로 쓴다. 두 계열을 한 섹션에서 섞지 않는다.

| 토큰 | 클래스 예 | 값 | 원본 hex | 용도 |
| --- | --- | --- | --- | --- |
| `chef` | `text-chef` `bg-chef` | `oklch(63% 0.11 181)` | `#0f9d8c` | AIR CHEF 주색 — eyebrow·STEP 라벨·수치 강조·활성 탭 보더 |
| `chef-hover` | `hover:bg-chef-hover` | `oklch(53% 0.09 181)` | `#0a7d70` | hover / 그라디언트 끝 / 배지 텍스트 |
| `chef-soft` | `text-chef-soft` | `oklch(80% 0.11 181)` | `#5fd6c6` | **`chef-dark` 위** eyebrow·아이콘·라벨 (`brand-soft` 대응) |
| `chef-tint` | `bg-chef-tint` | `oklch(98% 0.013 181)` | `#eefaf8` | 연청록 카드·배지 배경 (`#e7f7f4` 포함) |
| `chef-tint-border` | `border-chef-tint-border` | `oklch(91% 0.044 181)` | `#c3ece5` | 연청록 보더 (`#b3e6dd` 포함) |
| `chef-dark` | `bg-chef-dark` | `oklch(22% 0.033 181)` | `#04201d` | 주방 다크 섹션 배경 (`#08221f` 포함 — 지각적 동일) |
| `chef-dark-tint` | `bg-chef-dark-tint` | `oklch(32% 0.05 181)` | `#0c3a34` | 에어쉴드 radial 상단 딥그린 (`navy-tint` 대응) |

- **대비 규칙**: `chef-dark` 위에서는 `chef` 가 아니라 **`chef-soft`** 를 쓴다(`chef`는 딥그린 위 대비 부족). 라이트 배경 위 강조는 `chef`, 그 위 텍스트는 흰색(`text-white`).
- **그라디언트**: 아이콘 박스·프로그레스 바 `from-chef to-chef-hover`. 에어쉴드 배경 `radial-gradient(110% 120% at 85% 0%, var(--color-chef-dark-tint), var(--color-chef-dark) 62%)`.
- **글로우/반투명**: `bg-chef/12` · `bg-chef/25` · `bg-chef/42` (radial 글로우), 보더 `border-chef-soft/35` · `border-chef-soft/40` — §2 "기본 토큰 + opacity" 규칙에 따라 하드코딩 아님.
- `chef-ink`(=white)는 **정의하지 않는다** — 기존 `text-white`/`brand-ink` 로 충분(추가 최소 원칙).

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
| `text-hero` † | 60 | `text-h6` | 28 |
| `text-stat-lg` † | 60 | `text-subtitle` | 26 |
| `text-display` † | 56 | `text-lead` | 17 |
| `text-h1` † | 52 | `text-lead-sm` | 16.5 |
| `text-stat` † | 46 | `text-meta` | 13.5 |
| `text-h2` † | 44 | `text-eyebrow` | 12.5 |
| `text-section` † | 40 | `text-mini` | 11 |
| `text-h3` † | 38 | `text-nano` | 10.5 |
| `text-h4` † | 36 |  |  |
| `text-h5` † | 34 |  |  |

† = **fluid clamp 토큰**: 표의 px는 데스크탑(≥640px) 값. 360px에서 최소값(60~36px 계열 → 36 / 44~34px 계열 → 28)으로 시작해 640px(sm)에서 원값에 도달한다.

**기본 유틸 재사용**: `text-7xl`(72) `text-5xl`(48) `text-2xl`(24) `text-xl`(20·22 근사) `text-lg`(18) `text-base`(16) `text-sm`(14·15 근사) `text-xs`(12).

**반응형 타이포 정책 (fluid 토큰 · 이슈 #155)**: 헤딩·통계 토큰은 **값 자체가 `clamp()`** 다 — 사용처는 단일 토큰 클래스만 쓰고 `text-4xl sm:text-hero` 같은 브레이크포인트 페어를 만들지 않는다. 360px에서 min, 640px(sm)에서 max에 도달하며, **≥640px에서는 clamp 상한으로 기존 데스크탑 값과 픽셀 동일(무회귀)**, 360~640px 구간만 선형 보간된다. `text-h6`(28) 이하 및 본문·캡션 스케일은 fluid를 적용하지 않는다(축소 없음 정책). 신규로 반복되는 반응형 수치는 사용처마다 페어를 붙이는 대신 **fluid 토큰 추가를 우선 검토**한다.

산식: `preferred = (max−min)/2.8 vw + (min − (max−min)×9/7) px` (360→640px 선형, vw 계수는 소수 4자리 올림 → 640px에서 preferred ≥ max가 되어 clamp 상한이 max로 캡)

| 토큰 | 360px min | preferred | ≥640px max |
| --- | --- | --- | --- |
| `text-hero` / `text-stat-lg` | 36 | `8.5715vw + 0.3214rem` | 60 |
| `text-display` | 36 | `7.1429vw + 0.6429rem` | 56 |
| `text-h1` | 36 | `5.7143vw + 0.9643rem` | 52 |
| `text-stat` | 36 | `3.5715vw + 1.4464rem` | 46 |
| `text-h2` | 28 | `5.7143vw + 0.4643rem` | 44 |
| `text-section` | 28 | `4.2858vw + 0.7857rem` | 40 |
| `text-h3` | 28 | `3.5715vw + 0.9464rem` | 38 |
| `text-h4` | 28 | `2.8572vw + 1.1071rem` | 36 |
| `text-h5` | 28 | `2.1429vw + 1.2679rem` | 34 |

(구 페어 방식 정리: `SectionHeader`의 `text-[28px] sm:text-[40px]` → `text-section`, `HistoryTimeline`의 `text-h6 sm:text-h3` → `text-h3`, `Dark/LightStatCard`의 `text-4xl sm:text-6xl` → `text-stat-lg`로 수렴 완료)

### 트래킹 (letter-spacing)

`tracking-wordmark`(-0.03em) · `tracking-headline`(-0.02em) · `tracking-label-sm`(0.05em) · `tracking-label`(0.1em) · `tracking-caption`(0.12em) · `tracking-eyebrow`(0.14em) · `tracking-eyebrow-lg`(0.18em) · `tracking-wide`(0.4em).

한글 본문에는 음수 자간 최소화, `word-break: keep-all` 적용(body 기본). 라인 높이: 헤드라인 `1.05~1.32` · 본문 `1.5~1.8` · 숫자 `1` · 워드마크 `.9`.

---

## 4. 라운드 · 스페이싱 · 그림자 · 모션

**라운드**: `rounded-btn`(12) · `rounded-image`(18) · `rounded-card`(20) · `rounded-card-lg`(22) · `rounded-pill`(999) · `rounded-full`(9999). 16/14 는 기본 `rounded-2xl`(16)·`rounded-btn` 근사 재사용.

**스페이싱**: Tailwind 기본 4px 그리드. 섹션 수직 패딩 `py-24`(96, 기본) / `py-20`(80) / `py-28`(112).
> ⚠️ `globals.css`에 구 커스텀 스케일 `--spacing-5~10`(5=24, 6=32, 7=48, 8=64, 9=80, **10=120**)이 회귀 방지를 위해 남아 있다(`p-5`~`p-10` 사용처 재조정 후 제거 대상). 신규 작업은 순수 기본 그리드를 쓴다.
>
> ⚠️ **정수 스텝 5~10 은 4px 그리드가 아니다.** `h-10`은 40px이 **아니라 120px**이다. 이 블록이 덮는 것은 **정수 스텝뿐**이므로, 정의되지 않은 스텝(`11`·`7.5`·`8.5`·`130` 등)은 기본 `--spacing`(0.25rem) 파생으로 정상 계산된다(`min-h-11`=44px, `h-7.5`=30px). 5~10 구간의 4px 그리드 값이 필요하면 소수/미정의 스텝을 쓰거나(예: 30px=`h-7.5`), 그마저 정수와 충돌하면(예: **40px**) 블록 제거 전까지 토큰이 없다 — 이 경우 `{/* token 없음: 이유 */}` 주석 + `unresolvedIssues` 기재.

**그림자 (블루/블랙 글로우)**: `shadow-brand-sm`(헤더 pill) · `shadow-brand`(히어로/플랫폼 CTA) · `shadow-soft`(CTA 흰 버튼) · `shadow-float`(히어로 플로팅 카드) · `shadow-card`(관리자 패널 카드).

**모션**: `duration-fast`(200ms, 커스텀 유틸리티) · `ease-out`(`cubic-bezier(0.16,1,0.3,1)`).

### 애니메이션 토큰 (`--animate-*` + `@keyframes`)

| 클래스 | 정의 | 용도 |
| --- | --- | --- |
| `animate-marquee-left` / `-right` | `marquee-* 40s linear infinite` | 파트너 로고 2줄 무한 스크롤(`<LogoMarquee>`) |
| `animate-drift` | `drift 18s ease-in-out infinite` | 다크 섹션 장식 orb 앰비언트 부유 |
| `animate-panel-fade` | `panel-fade 400ms var(--ease-out)` | 탭 패널 진입 페이드 |
| `animate-fade-up` | `fade-up 900ms var(--ease-out) both` | **히어로 첫 렌더** 진입(페이드+상향 16px). `reveal-delay-*` 스태거와 조합 |

### 진입/스크롤 리빌 (홈 랜딩 애니메이션 · 이슈 #144)

두 메커니즘으로 나뉜다. **첫 렌더(위 폴드)** 는 순수 CSS 키프레임, **뷰포트 진입(스크롤)** 은 공용 client 컴포넌트다.

- **히어로 첫 렌더** = `animate-fade-up`(키프레임, fill both) + `reveal-delay-1~6`(140ms 스텝 스태거). JS 없이 마운트 시 자동 재생. 요소마다 `reveal-delay-*` 로 순차 등장. base 에 `opacity-0` 를 두지 않는다 — 은닉은 키프레임 0% 가 담당하고, reduced-motion 시 `animation:none` 이면 자연 상태(visible)가 된다.
- **섹션 스크롤 리빌** = 공용 client 컴포넌트 `<ScrollReveal>`(`src/shared/ui`). Tailwind 유틸 클래스 기반으로 동작하며, **SSR 에는 표시(shown) 상태를 출력**하고 마운트 후에만 은닉(hidden)을 주입한 뒤 뷰포트 교차 시 표시로 전이한다 → **No-JS·reduced-motion 사용자에게도 콘텐츠가 항상 노출**된다(영구 은닉 회귀 없음). 섹션 리빌에 CSS `.reveal`/`reveal-*` 유틸을 쓰지 않는 이유가 이것이다(아래 note 참조).

| 클래스 | 정의 | 용도 |
| --- | --- | --- |
| `reveal-delay-1`~`-6` | `animation-delay` + `transition-delay` = 140ms×N | 히어로 첫 렌더 키프레임 스태거 지연(`animate-fade-up` 과 조합) |

> **미채택 note — CSS `.reveal`/`reveal-up/left/right/scale` 전이 유틸.** Round 1 에서 검토했던 `opacity:0` base + `data-revealed` 토글 방식의 CSS 스크롤 리빌 유틸은 **최종 미채택**했다. 이 방식은 초기 은닉이 CSS 에 하드 고정되어 **JS 비활성(No-JS) 사용자에게 콘텐츠가 영구 은닉**되는 접근성 회귀(#144 금지 사항)를 유발한다. 섹션 스크롤 리빌은 SSR 에 shown 을 출력하는 `<ScrollReveal>` 컴포넌트로 대체했고, 해당 CSS 유틸은 globals.css 에서 제거했다.

- **거리·시간 기준선**: 이동 거리 16px(=`translate-y-4`) · `ease-out` 은 `HistoryTimeline`(translate-y-4 / ease-out)과 통일하고, `ScrollReveal` 도 동일 기준선을 유틸 클래스로 따른다. 지속시간은 두 메커니즘이 다르다 — **히어로 첫 렌더만 900ms**(위 폴드 단독 시퀀스라 여유 있는 템포가 필요), 섹션 스크롤 리빌은 기존 값 유지(스크롤 중 재생되므로 짧게). **과한 이동·바운스 금지.**
- **스태거 스텝 140ms**: 히어로 고정 시퀀스는 `reveal-delay-*` 로 140ms 스텝(마지막 단계 delay-4 = 560ms + 900ms ≈ 1.46s 종료). `Tailwind delay-*` 는 `transition-delay` 만 건드려 키프레임 진입에 못 쓰므로 `reveal-delay-*` 가 두 delay 를 함께 설정한다.
- **reduced-motion**: 하단 전역 블록이 `animate-fade-up` 을 `animation:none` 으로 무효화 → 히어로가 자연 상태(visible)로 즉시 표시. 섹션 리빌은 `<ScrollReveal>` 이 SSR 에 shown 을 출력하므로 reduced-motion·No-JS 양쪽에서 이미 표시 상태다. 컴포넌트에서 재분기 금지. 마퀴(`animate-marquee-*`)에는 리빌/stagger 를 걸지 않는다(marquee-left/right 충돌 방지).

- 지속시간·이징 키워드는 `--animate-*` 토큰 **값에 인라인**한다(별도 `--duration-*` 토큰을 만들지 않는다 — marquee `40s linear` 선례).
- `drift` 진폭 `translate(30px,-24px)`·`panel-fade` 의 `translateY(10px)` 는 marquee 의 `translateX(-50%)` 와 같은 **패턴/방향 정의 자체**이므로 하드코딩 수치가 아니다.
- **`animate-drift` 대상은 `aria-hidden` 장식 orb 한정.** blur 처리된 글로우에만 쓰고 콘텐츠에는 쓰지 않는다.
- **`animate-panel-fade` 는 fill-mode 를 두지 않는다.** 재생 후 자연 상태로 복귀시켜 잔류 `transform` 이 만드는 containing block(내부 fixed/sticky 오작동)을 피한다. `hidden`(display:none) → 표시 전환 시 브라우저가 애니메이션을 재시작하므로 클라이언트 상태·`key` 추가 없이 전환마다 재생된다.
- ⚠️ `src/views/home/ui/hero.module.css` 의 로컬 `heroDrift`(16s / 20s reverse 2종)는 동일 진폭의 **중복 정의**다. 단일 `animate-drift`(18s)로 표현되지 않아 통합하지 않았다 — 후속 정리 대상.

### 카드 호버 표준

반복되는 className 레시피이며 마크업 구조가 제각각(`li`·`div`·grid item)이라 **공용 컴포넌트로 만들지 않는다**. 아래 레시피를 그대로 인라인한다(`NewsCard`·`LightStatCard`·`DarkStatCard` 선례).

| 대상 | 레시피 |
| --- | --- |
| 라이트 섹션 카드 | `transition-all duration-fast ease-out hover:-translate-y-1 hover:shadow-card` |
| 라이트 섹션 그리드 카드 · 스크린 목업 | `… hover:-translate-y-1 hover:shadow-float` (+ 보더가 있으면 계열 보더 강조) |
| 다크 섹션 카드 | `… hover:-translate-y-1` + **보더/배경 강조** (그림자는 다크 위에서 읽히지 않는다) |

- 계열 보더 강조: 실내=`hover:border-tint-border` · 주방=`hover:border-chef-tint-border`(라이트) / `hover:border-chef-soft/40`(다크). **계열 분리 원칙 §2 를 호버에도 적용**한다.
- 리프트는 `transform` 이라 레이아웃 시프트(CLS)가 없다. `top`/`height` 등으로 대체 금지.
- **호버에 정보를 싣지 않는다.** 터치·키보드 사용자가 접근할 수 없으므로 어포던스(클릭 가능함의 힌트) 이상을 담지 않는다. 인터랙티브 요소는 `focus-visible:ring-brand` 를 함께 제공한다.

### `prefers-reduced-motion` (필수)

`globals.css` 하단 블록이 **전역으로** 처리하므로 개별 컴포넌트에서 다시 분기하지 않는다.

1. 무한 루프·진입 애니메이션(`animate-marquee-*`·`animate-drift`·`animate-panel-fade`)은 `animation: none` 으로 **완전히** 끈다. fill-mode 가 없어 끈 상태 = 자연 상태다(orb 제자리 · 패널 그대로 표시).
2. 그 외 모든 트랜지션·애니메이션은 `*`/`::before`/`::after` 리셋으로 즉시 완료시킨다(`animation-duration`/`transition-duration: 0.01ms !important`, `animation-iteration-count: 1`). `none` 이 아니라 `0.01ms` 인 이유는 `transitionend`/`animationend` 가 계속 발생해 이벤트 의존 로직을 깨지 않는 표준 리셋이기 때문이다.

결과적으로 `hover:-translate-y-1` 같은 호버 상태 변화는 **이동 애니메이션이 제거되고** 포인터 직접 제어 하의 정적 상태 변화만 남는다(`hover:bg-*` 와 동일 범주 — WCAG 2.3.3 은 상호작용으로 촉발되는 *모션 애니메이션*이 대상). **신규 모션은 이 블록이 자동으로 커버하므로 컴포넌트에 별도 대응을 추가하지 않는다.**

**Aspect(매거진 레이아웃, 기능 토큰)**: `aspect-featured`(16/7) · `aspect-card`(16/10, 뉴스 목록 카드 썸네일) · `aspect-row-thumb`(4/3).

**줄무늬 플레이스홀더(이미지 자산 폴백, 유틸)**: `stripes-surface`(회색계) · `stripes-tint`(연블루계) · `stripes-chef`(연청록계 — AIR CHEF 주방 섹션) · `stripes-dark`(네이비 섹션 위 흰색 반투명 라인). `-45deg` 대각선 repeating-linear-gradient — 각도·줄 간격은 패턴 정의 자체(하드코딩 아님, marquee `translateX(-50%)` 와 동일 취급). 공용 컴포넌트 `<PagePlaceholder>`가 이 유틸들을 5종 `variant`(surface·tint·dark·chef·chef-dark)로 감싸며, 모든 이미지 자산 미확보 자리(뉴스 coverImage 폴백·About 이미지 자리·`/services` 슬롯 폴백 등)의 **단일 표준**이다. `chef-dark`는 별도 유틸 없이 `stripes-dark`를 재사용한다 — 흰색 반투명 라인은 계열 중립이고 배경색은 섹션의 `bg-chef-dark`가 제공하기 때문이다.

**Catalog 진행 슬라이더(기능 유틸)**: `catalog-range` — 카탈로그 뷰어 다크 푸터의 `<input type="range">` 페이지 진행 바. 트랙은 `--color-brand`→`--color-cyan` 그라디언트, 썸은 다크 위 대비를 위한 흰 원(`surface-white` + `cyan` 2px 링 + `shadow-brand-sm`). webkit(`::-webkit-slider-runnable-track`/`-thumb`)·moz(`::-moz-range-track`/`-thumb`) 양쪽 커버, focus-visible 링 포함. 트랙 6px·썸 16px 형상값과 수직 정렬 오프셋은 컨트롤 형상 정의(하드코딩 색 아님). `input`에는 `catalog-range appearance-none bg-transparent` 조합으로 적용.

**content-container**: `max-width:1240px; margin-inline:auto; padding-inline:2rem`.

**reading 칼럼**: `max-w-reading`(=`--container-reading` 47.5rem/760px). 뉴스 상세 article·PageHero 텍스트 칼럼 등 좁은 읽기 폭. content-container 내부에서 `mx-auto max-w-reading` 로 조합.

---

## 5. 공용 컴포넌트 우선

작업 전 `src/shared/ui/index.ts` 확인. 동일 역할 마크업 중복 금지. 반복 패턴 3곳 이상이면 `shared/ui`에 추가 후 `index.ts` export.

**구현됨 (이슈 #102 Pre)**:

- `<Button variant="primary|dark|outline|white|secondary|destructive" size="sm|md" pill? asChild?>` — primary=히어로/헤더 CTA(그라디언트 `from-brand to-brand-hover`), dark=라이트 섹션 보조 CTA(`bg-navy`), outline=다크/컬러 배경 위 보조(`border-white/50`), white=CTA 컬러 섹션 흰 버튼(`shadow-soft`). `pill`=헤더 도입문의(rounded-pill), 기본 rounded-btn. `asChild`로 Next `<Link>` CTA 렌더. md=44px 터치타겟, primary만 글로우 그림자(sm=`shadow-brand-sm`/md=`shadow-brand`).

**Button variant 추가 (이슈 #122)** — 관리자 화면의 중립/파괴적 버튼용. `ConfirmDialog` 의 취소·삭제 버튼 톤을 승계하되 §6 대응표의 **신 토큰**으로 정의했다(구 토큰 alias 와 색상값 자체는 동일).

  | `variant` | 정의 | 용도 |
  | --- | --- | --- |
  | `secondary` | `bg-surface text-ink hover:bg-hairline focus-visible:ring-brand` | 라이트 배경 위 중립 보조 — 에러 상태 "다시 시도", 취소 |
  | `destructive` | `bg-error text-white hover:opacity-90 focus-visible:ring-error` | 삭제 등 파괴적 액션 |

  - 글로우 그림자는 `primary` 전용이라는 기존 규칙이 그대로 적용된다(secondary/destructive 는 그림자 없음).
  - 관리자 에러 상태의 "다시 시도" 버튼은 `<Button variant="secondary" size="sm" className="min-h-11">` 조합을 표준으로 한다 — `size="sm"` 에는 `min-h` 가 없어 44px 터치 타겟을 `min-h-11` 로 보정한다.
  - ⚠️ `ConfirmDialog` 는 자체 버튼 마크업(`text-[15px]`·`min-h-[44px]`)을 유지한다. `Button` 의 `SIZE` 스케일과 값이 달라 치환 시 시각 회귀가 발생하므로, 별도 사이즈 정리 작업에서 통합한다.
- `<SectionLabel color="brand|cyan" size="md|sm" as?>` — eyebrow. Sora(`font-display`)·uppercase·600. md=`text-eyebrow tracking-eyebrow-lg`(섹션), sm=`text-mini tracking-eyebrow`(카드). ⚠️ eyebrow 남용 금지: 섹션 3개당 1개 이하.

**구현됨 (이슈 #111 Pre)**:

- `<PagePlaceholder variant="surface|tint|dark|chef|chef-dark" label? rounded? bordered? className? children?>` — 이미지 자산 미확보 자리의 표준 줄무늬 블록. `variant`가 §4 `stripes-*` 유틸과 보더·라벨 톤을 함께 전환한다. 라벨은 `font-display text-mini font-semibold uppercase tracking-eyebrow`(Sora eyebrow) 표준. 라운드는 `rounded` prop(기본 `rounded-card`)으로, 크기·비율은 `className`으로 주입. 뉴스 coverImage 폴백·About 이미지 자리·`/services` 슬롯 폴백 등 **모든 플레이스홀더의 단일 소스**.

  | `variant` | 줄무늬 유틸 | 보더 | 라벨 톤 | 사용처 |
  | --- | --- | --- | --- | --- |
  | `surface` (기본) | `stripes-surface` | `border-hairline` | `text-faint` | 라이트 섹션(회색계) |
  | `tint` | `stripes-tint` | `border-tint-border` | `text-faint` | 라이트 섹션(연블루계) |
  | `dark` | `stripes-dark` | `border-white/8` | `text-white/40` | `bg-navy` 다크 섹션 |
  | `chef` | `stripes-chef` | `border-chef-tint-border` | `text-faint` | AIR CHEF 라이트 카드 |
  | `chef-dark` | `stripes-dark` (재사용) | `border-chef-soft/35` | `text-chef-soft/60` | `bg-chef-dark` 주방 다크 섹션 |

  ⚠️ **`chef-dark` 가 `dark` 와 별도로 존재하는 이유**: §2 대비 규칙(`chef-dark` 위 라벨은 `chef` 가 아니라 `chef-soft`)을 지키기 위함이다. 주방 다크 섹션에 `dark` 를 쓰면 eyebrow 가 흰색으로 렌더되어 규칙 위반이다. 라이트 계열(`surface`/`tint`/`chef`)의 라벨 톤이 `text-faint` 로 통일된 것은 의도적이다 — 플레이스홀더 라벨은 실제 콘텐츠처럼 보이지 않게 저채도 뉴트럴로 억제한다(`chef-dark` 의 `/60` 도 `dark` 의 `white/40` 과 지각 밝기를 맞춘 값). 풀블리드 배경 슬롯은 `bordered={false}`.

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

**유지(기능 토큰, 마이그레이션 대상 아님)**: `nav-bg*`, `overlay-*`, `aspect-featured`, `aspect-row-thumb`, `animate-marquee-*`, `animate-drift`, `animate-panel-fade`, `success/warning/error`, `shadow-card`.

> 구 올리브/크림/라임 방향 컴포넌트 명세는 이전 문서에서 이미 제거됐다. Blue-Tech 컴포넌트 명세(Hero·AQI Card·Trust Strip·Tabs·4-Step·Our Value·Platform·Wordmark·Clients·CTA·Footer)는 홈페이지/About 마이그레이션과 함께 재문서화한다. 그 전까지는 위 대응표로 구 토큰 사용처를 신 토큰으로 옮긴다.
