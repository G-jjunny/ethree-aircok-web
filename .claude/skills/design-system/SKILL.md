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

### AIR CHEF · 주방 계열 (`--chef-hue: 181` 파생)

> ⚠️ **계열 분리 원칙.** chef 계열은 **`/services` 주방(AIR CHEF) 탭 내부에서만** 쓴다. 실내 공기질(스마트 에어콕) 섹션·공용 CTA·헤더/푸터는 `brand`/`cyan`/`navy` 를 그대로 쓴다. **두 계열을 한 섹션에서 섞지 않는다.**
>
> ⚠️ **대비 규칙.** `chef-dark` 위에는 **`chef` 금지 → `chef-soft` 필수** (`chef`는 딥그린 위 대비 부족). 라이트 배경 위 강조만 `chef`, 그 위 텍스트는 `text-white`.

- 주색(라이트 배경 eyebrow·STEP 라벨·수치 강조·활성 탭 보더): `text-chef` / `bg-chef`
- hover / 그라디언트 끝 / 배지 텍스트: `hover:bg-chef-hover` · `text-chef-hover` (아이콘 박스·프로그레스 바 `from-chef to-chef-hover`)
- **다크(`bg-chef-dark`) 위** eyebrow·아이콘·라벨: `text-chef-soft` (`brand-soft` 대응)
- 연청록 카드/배지 배경: `bg-chef-tint` + `border-chef-tint-border`
- 주방 다크 섹션 배경: `bg-chef-dark` · radial 상단 딥그린: `bg-chef-dark-tint` (`navy-tint` 대응)
- 반투명(기본 토큰 + opacity, 하드코딩 아님): 글로우 `bg-chef/12` `bg-chef/25` `bg-chef/42` · 보더 `border-chef-soft/35` `border-chef-soft/40`
- `chef-ink`는 **없다** — chef 위 텍스트는 `text-white` 사용(추가 최소 원칙).

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
- 애니메이션: `animate-marquee-left/right`(로고 마퀴) · `animate-drift`(다크 섹션 `aria-hidden` 장식 orb 부유) · `animate-panel-fade`(탭 패널 진입). 신규 keyframes 는 `--animate-*` 토큰 + `@keyframes` 로 globals.css 에 정의하고 design.md 에 문서화한다(지속시간·이징은 토큰 값에 인라인).

### 카드 호버 표준 (className 레시피 — 공용 컴포넌트 아님)

- 라이트 섹션 카드: `transition-all duration-fast ease-out hover:-translate-y-1 hover:shadow-card`
- 라이트 그리드 카드/스크린 목업: 위 + `hover:shadow-float` (보더 있으면 계열 보더 강조)
- 다크 섹션 카드: 리프트 + **보더/배경 강조** (그림자는 다크 위에서 안 읽힌다)
- 계열 보더: 실내 `hover:border-tint-border` · 주방 `hover:border-chef-tint-border`(라이트) / `hover:border-chef-soft/40`(다크) — 계열 분리 원칙을 호버에도 적용
- 리프트는 `transform` 만(CLS 금지). **호버에 정보를 싣지 않는다** — 어포던스까지만. 인터랙티브 요소는 `focus-visible:ring-brand` 동반.

### prefers-reduced-motion

globals.css 하단 블록이 **전역 처리**한다(무한/진입 애니메이션은 `animation:none`, 그 외는 0.01ms 리셋). **컴포넌트에서 다시 분기하지 말 것** — 신규 모션은 자동 커버된다.

### content-container (강제)

섹션 내부 래퍼는 `content-container`만 사용(max-width 1240 / padding 32). `max-w-* mx-auto px-*` 직접 금지. 좁은 읽기 칼럼(뉴스 상세 article 등)은 `mx-auto max-w-reading`(760px 토큰) 사용, `max-w-[760px]` 금지.

### Aspect / 플레이스홀더

- Aspect: `aspect-featured`(16/7) `aspect-card`(16/10, 목록 카드 썸네일) `aspect-row-thumb`(4/3). `aspect-[..]` 하드코딩 금지.
- 줄무늬 유틸: `stripes-surface`(회색계) / `stripes-tint`(연블루계) / `stripes-chef`(연청록계 — AIR CHEF 주방) / `stripes-dark`(다크 섹션 위 흰 반투명 라인). 인라인 repeating-linear-gradient 하드코딩 금지.
- **이미지 자산 미확보 자리는 유틸 직접 조합 대신 `<PagePlaceholder>` 단일 소스를 쓴다.**
  `variant="surface|tint|dark|chef|chef-dark"` — 주방 라이트 카드=`chef`, `bg-chef-dark` 섹션 위=`chef-dark`(eyebrow 를 `chef-soft` 로 렌더해 위 대비 규칙을 지킨다. 주방 다크 섹션에 `dark` 를 쓰면 라벨이 흰색이 되어 규칙 위반).

## 구 토큰은 쓰지 않는다 (deprecated)

`aircok-blue`→`brand` · `aircok-blue-light`/`accent`→`cyan` · `olive*`→`brand`/`brand-soft` · `surface-dark*`→`navy` · `heading-dark`→`ink` · `body-dark`→`ink-soft` · `secondary-dark`→`muted` · `border-light/subtle`→`hairline` · `text-nav`→`text-sm` · `text-subheading`→`text-xl`. 신규 작업엔 신 토큰만.

## 공용 컴포넌트 우선

작업 전 `src/shared/ui/index.ts` 확인. 동일 역할 마크업 중복 금지.
반복 패턴 3곳 이상이면 shared/ui에 추가 후 index.ts export.

## 재사용 우선 순서

기존 토큰 재사용 → shared/ui 재사용 → 3곳 이상 반복 시 shared/ui 추가 → 그래도 없으면 design.md 갱신 후 구현.
변경의 기본값은 "추가"가 아니라 "재사용".
