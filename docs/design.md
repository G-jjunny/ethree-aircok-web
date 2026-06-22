# Design System: Aircok (Apple Style)

> 이 문서는 living document입니다. `design` 서브에이전트가 마크업/className 작업의 기준으로 참조하며, design.md에 없는 새 패턴이 필요할 때는 design 에이전트가 이 문서를 먼저 갱신한 뒤 작업을 진행합니다.
> 원본 기반: https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/apple/DESIGN.md

---

## 0. Aircok 브랜드 정체성

**스마트에어콕(Aircok)**은 스마트 공기질 제어 솔루션 기업입니다. "공기(Air)"와 "코크(Cock, 밸브)"를 결합한 이름처럼, 깨끗하고 정밀하게 제어되는 공기 환경을 제공하는 것이 핵심 가치입니다.

### 브랜드 톤
- **신뢰감**: 기업·공공기관을 고객으로 하는 B2B 성격 — 과하지 않고 안정적인 인상
- **청결함**: 공기·환경 브랜드답게 여백과 화이트 스페이스를 충분히 활용
- **정밀함**: Apple 스타일의 제품 중심 레이아웃으로 기술력·완성도를 시각적으로 표현
- **한국적 맥락**: 주요 사용자가 한국어 독자이므로 한국어 가독성을 최우선

### 홈페이지 주요 섹션 (예상 구조)
1. Hero — 브랜드 슬로건 + 주력 제품 시각화
2. 제품 라인업 — 제품 그리드 타일
3. 핵심 기술/기능 특징 — Feature Strip
4. 도입 사례/레퍼런스 — Case Study Grid
5. 회사 소개 — About
6. 문의/CTA — Contact

---

## 토큰 정의 및 사용 규칙

### ⚠️ 필수 규칙: 하드코딩 금지

색상·크기·간격·폰트·그림자 값을 **직접 하드코딩하는 것은 원칙적으로 금지**입니다.
아래에 정의된 Tailwind 유틸리티 클래스 또는 CSS 변수(`var(--...)`)만 사용합니다.

**절대 금지 예시:**
```tsx
// ❌ 색상 하드코딩
className="bg-[#0057ff] text-[#1d1d1f] rounded-[8px] p-[24px] shadow-[rgba(0,0,0,0.12)_0px_4px_24px]"

// ✅ 토큰 사용
className="bg-aircok-blue text-heading-dark rounded-md p-6 shadow-card"
```

**예외**: 디자인 시스템에 없는 1회성 레이아웃 수치에 한해 임시 하드코딩을 허용하되, 반드시 주석으로 이유를 명시하고 design.md 갱신을 함께 제안해야 합니다.

---

### CSS 변수 정의 (`app/globals.css` → `@theme` 블록)

Tailwind v4 프로젝트이므로 모든 토큰은 `@theme` 블록 안에 정의합니다. 정의된 변수는 자동으로 Tailwind 유틸리티(`bg-*`, `text-*`, `rounded-*` 등)로 변환됩니다.

```css
@import "tailwindcss";

@theme inline {
  /* ── Fonts ─────────────────────────────── */
  --font-display: 'Pretendard', 'SF Pro Display', -apple-system, 'Helvetica Neue', sans-serif;
  --font-body:    'Pretendard', 'SF Pro Text',    -apple-system, 'Helvetica Neue', sans-serif;

  /* ── Brand Colors ───────────────────────── */
  --color-aircok-blue:       #0057ff;
  --color-aircok-blue-dark:  #0040cc;
  --color-aircok-blue-light: #3d7fff;

  /* ── Surface Colors ─────────────────────── */
  --color-surface-white: #ffffff;
  --color-surface-light: #f5f5f7;
  --color-surface-dark:  #0a0a0a;
  --color-surface-dark-1: #1a1a1a;
  --color-surface-dark-2: #242424;

  /* ── Text Colors ────────────────────────── */
  --color-heading-dark:    #1d1d1f;
  --color-body-dark:       rgba(0, 0, 0, 0.80);
  --color-secondary-dark:  rgba(0, 0, 0, 0.48);
  --color-heading-light:   #ffffff;
  --color-body-light:      rgba(255, 255, 255, 0.86);

  /* ── Semantic / Link ────────────────────── */
  --color-link-on-light: #0057ff;
  --color-link-on-dark:  #3d7fff;
  --color-focus:         #0057ff;

  /* ── Feedback ───────────────────────────── */
  --color-success: #34c759;
  --color-warning: #ff9f0a;
  --color-error:   #ff3b30;

  /* ── Border Radius ──────────────────────── */
  --radius-sm:   6px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-xl:   16px;
  --radius-pill: 980px;

  /* ── Shadows ────────────────────────────── */
  --shadow-card:    rgba(0, 0, 0, 0.12) 0px 4px 24px 0px;
  --shadow-product: rgba(0, 0, 0, 0.22) 3px 5px 30px 0px;

  /* ── Nav / Overlay ──────────────────────── */
  --color-nav-bg:            rgba(255, 255, 255, 0.80);
  --color-nav-bg-mobile:     rgba(255, 255, 255, 0.95);
  --color-overlay-white-10:  rgba(255, 255, 255, 0.10);
  --color-overlay-dark:      rgba(0, 0, 0, 0.80);
  --color-overlay-dark-60:   rgba(0, 0, 0, 0.60);

  /* ── Border ─────────────────────────────── */
  --color-border-light:  rgba(0, 0, 0, 0.06);
  --color-border-subtle: rgba(0, 0, 0, 0.04);
  --color-border-dark:   rgba(255, 255, 255, 0.08);

  /* ── Aspect Ratios (매거진 레이아웃) ────── */
  --aspect-featured:  16 / 7;  /* News Featured Hero / Detail overlay hero 와이드 비율 */
  --aspect-row-thumb: 4 / 3;   /* News Horizontal Row 썸네일 비율 */

  /* ── Spacing (8px base) ─────────────────── */
  --spacing-1:  4px;
  --spacing-2:  8px;
  --spacing-3:  12px;
  --spacing-4:  16px;
  --spacing-5:  24px;
  --spacing-6:  32px;
  --spacing-7:  48px;
  --spacing-8:  64px;
  --spacing-9:  80px;
  --spacing-10: 120px;
}
```

> **Aspect 토큰 사용**: `--aspect-featured`는 `aspect-featured`, `--aspect-row-thumb`는 `aspect-row-thumb` 유틸리티로 사용한다. 기존 카드의 `aspect-video`(16/9)는 유지하며, 매거진 와이드 영역에만 신규 토큰을 적용한다.

---

### Tailwind 유틸리티 클래스 대응표

| 역할 | Tailwind 클래스 | CSS 변수 |
|------|----------------|---------|
| **브랜드 컬러** | | |
| 주 액센트 배경 | `bg-aircok-blue` | `--color-aircok-blue` |
| 주 액센트 텍스트 | `text-aircok-blue` | `--color-aircok-blue` |
| hover/dark CTA | `bg-aircok-blue-dark` | `--color-aircok-blue-dark` |
| 다크 BG 링크 | `text-aircok-blue-light` | `--color-aircok-blue-light` |
| **서피스** | | |
| 라이트 섹션 배경 | `bg-surface-light` | `--color-surface-light` |
| 다크 섹션 배경 | `bg-surface-dark` | `--color-surface-dark` |
| 다크 카드 배경 | `bg-surface-dark-1` | `--color-surface-dark-1` |
| **텍스트** | | |
| 라이트 BG 헤딩 | `text-heading-dark` | `--color-heading-dark` |
| 라이트 BG 본문 | `text-body-dark` | `--color-body-dark` |
| 보조 텍스트 | `text-secondary-dark` | `--color-secondary-dark` |
| 다크 BG 헤딩 | `text-heading-light` | `--color-heading-light` |
| 다크 BG 본문 | `text-body-light` | `--color-body-light` |
| **Border Radius** | | |
| 태그·뱃지 | `rounded-sm` | `--radius-sm` (6px) |
| 버튼·인풋 | `rounded-md` | `--radius-md` (8px) |
| 카드·이미지 | `rounded-lg` | `--radius-lg` (12px) |
| 대형 카드·모달 | `rounded-xl` | `--radius-xl` (16px) |
| 자세히보기 링크 | `rounded-pill` | `--radius-pill` (980px) |
| **Shadow** | | |
| 카드 elevation | `shadow-card` | `--shadow-card` |
| 제품 이미지 | `shadow-product` | `--shadow-product` |
| **Nav / Overlay** | | |
| Nav glass 배경 | `bg-nav-bg` | `--color-nav-bg` |
| Nav 모바일 배경 | `bg-nav-bg-mobile` | `--color-nav-bg-mobile` |
| 흰 오버레이 10% | `bg-overlay-white-10` | `--color-overlay-white-10` |
| 다크 모달 오버레이 | `bg-overlay-dark` | `--color-overlay-dark` |
| 배경 이미지 오버레이 60% | `bg-overlay-dark-60` | `--color-overlay-dark-60` |
| **Border (반투명)** | | |
| 라이트 구분선 | `border-border-light` | `--color-border-light` |
| 미세 구분선 | `border-border-subtle` | `--color-border-subtle` |
| 다크 구분선 | `border-border-dark` | `--color-border-dark` |
| **폰트** | | |
| 디스플레이 헤딩 | `font-display` | `--font-display` |
| 본문 | `font-body` | `--font-body` |
| **레이아웃** | | |
| 콘텐츠 컨테이너 | `content-container` | `max-w-[1200px] mx-auto px-5` |
| 매거진 와이드 비율 | `aspect-featured` | `--aspect-featured` (16/7) |
| 가로 리스트 썸네일 비율 | `aspect-row-thumb` | `--aspect-row-thumb` (4/3) |

---

## 1. Visual Theme & Atmosphere

Apple 스타일의 '제품 우선 프레젠테이션'을 Aircok 브랜드에 적용합니다. UI는 의도적으로 후퇴하여 제품과 메시지가 전면에 나서도록 합니다.

- 넓은 여백과 순수 배경 위에 제품 이미지를 배치 — 공기처럼 가볍고 깨끗한 인상
- 라이트 섹션(`#f5f5f7`)과 다크 섹션(`#0a0a0a`) 교차로 시네마틱 리듬 구성
- 단일 액센트 컬러(Aircok Blue)로 모든 인터랙티브 요소 통일
- 장식적 그라디언트·텍스처 없음 — 색상 변화 자체가 구분선

**Key Characteristics:**
- Pretendard (한글) / SF Pro Display (영문 타이틀) — 광학 사이징 준수
- 라이트/다크 섹션 교차 리듬: `#f5f5f7` ↔ `#0a0a0a`
- 단일 액센트: Aircok Blue (`#0057ff`) — 인터랙티브 요소 전용
- 타이트한 헤드라인 line-height (1.07–1.14), 넉넉한 섹션 패딩
- Full-width 섹션 레이아웃, 콘텐츠 중앙 정렬

---

## 2. Color Palette & Roles

### Brand Primary
- **Aircok Blue** (`#0057ff`): 주요 CTA 배경, 포커스 링, 모든 인터랙티브 요소. 브랜드의 유일한 크로매틱 컬러.
- **Aircok Blue Dark** (`#0040cc`): 다크 배경 위 링크·버튼. 더 밝은 luminance로 대비 확보.
- **Aircok Blue Light** (`#3d7fff`): 다크 섹션 링크 텍스트. 검정 배경에서의 가독성.

### Surface
- **Pure White** (`#ffffff`): 기본 페이지 배경, 카드 배경
- **Light Gray** (`#f5f5f7`): 정보성 섹션 배경. 흰색보다 살짝 따뜻해 무균질함 방지.
- **Near Black** (`#0a0a0a`): 몰입형 히어로·다크 섹션 배경. Apple의 `#000000`보다 약간 부드럽게.
- **Dark Surface 1** (`#1a1a1a`): 다크 섹션 내 카드 배경
- **Dark Surface 2** (`#242424`): 다크 섹션 내 elevated 카드

### Text
- **Heading Dark** (`#1d1d1f`): 라이트 배경 헤딩
- **Body Dark** (`rgba(0, 0, 0, 0.80)`): 라이트 배경 본문
- **Secondary Dark** (`rgba(0, 0, 0, 0.48)`): 보조 텍스트, 캡션, 비활성 상태
- **Heading Light** (`#ffffff`): 다크 배경 헤딩
- **Body Light** (`rgba(255, 255, 255, 0.86)`): 다크 배경 본문

### Interactive
- **Link Light BG** (`#0057ff`): 라이트 배경 링크
- **Link Dark BG** (`#3d7fff`): 다크 배경 링크
- **Focus Ring** (`#0057ff`): 키보드 포커스 outline

### Feedback
- **Success** (`#34c759`): 성공 상태 (Apple iOS Green)
- **Warning** (`#ff9f0a`): 경고 상태
- **Error** (`#ff3b30`): 오류 상태

### Shadows
- **Card Shadow** (`rgba(0, 0, 0, 0.12) 0px 4px 24px 0px`): 제품 카드 elevation — 흰 배경에서 더 부드럽게 조정
- **Product Shadow** (`rgba(0, 0, 0, 0.22) 3px 5px 30px 0px`): 제품 렌더 이미지 전용

---

## 3. Typography Rules

### Font Family

**한글 우선**: Pretendard를 기본으로, 영문 디스플레이 타이틀에는 SF Pro Display 사용.

```css
--font-display: 'Pretendard', 'SF Pro Display', -apple-system, 'Helvetica Neue', sans-serif;
--font-body:    'Pretendard', 'SF Pro Text',    -apple-system, 'Helvetica Neue', sans-serif;
```

> Pretendard 로드: `@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css')`

**광학 사이징 규칙**: 20px 이상 → Display 계열(굵고 넓은 스트로크), 19px 이하 → Text 계열(촘촘하고 견고한 스트로크).

### Hierarchy

| Role | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|--------|-------------|----------------|-------|
| Display Hero | 56px (3.50rem) | 600 | 1.07 | -0.5px | 메인 히어로 헤드라인 |
| Article Hero | 48px (3.00rem) | 700 | 1.10 | -0.3px | 뉴스/아티클 상세 페이지 H1 (데스크탑) |
| Article Hero Mobile | 36px (2.25rem) | 700 | 1.14 | -0.2px | 뉴스/아티클 상세 페이지 H1 (모바일) |
| Section Heading | 40px (2.50rem) | 600 | 1.10 | -0.3px | 섹션 타이틀 |
| Tile Heading | 28px (1.75rem) | 500 | 1.14 | -0.1px | 제품 타일 헤드라인 |
| Article Sub-heading | 22px (1.375rem) | 600 | 1.14 | 0px | 아티클 본문 내 H3 |
| Card Title | 21px (1.31rem) | 700 | 1.19 | 0px | 카드 강조 헤딩 |
| Card News Title | 18px (1.125rem) | 600 | 1.35 | 0px | 뉴스 카드 제목 |
| Sub-heading | 21px (1.31rem) | 400 | 1.19 | 0px | 일반 카드 헤딩 |
| Body | 17px (1.06rem) | 400 | 1.65 | -0.2px | 한글 가독성을 위해 line-height 1.47→1.65 |
| Body Emphasis | 17px (1.06rem) | 600 | 1.47 | -0.2px | 강조 본문, 레이블 |
| Button | 17px (1.06rem) | 500 | 1.00 | 0px | 버튼 텍스트 |
| Link / Caption | 14px (0.88rem) | 400 | 1.43 | -0.1px | "자세히 보기", 설명 |
| Caption Bold | 14px (0.88rem) | 600 | 1.43 | -0.1px | 강조 캡션 |
| Micro | 12px (0.75rem) | 400 | 1.33 | 0px | 주석, 소인쇄 |

### 한글 특이사항
- **line-height**: 한글은 자소 높이가 커서 Body 기준 1.65 사용 (영문 1.47보다 여유 있게)
- **letter-spacing**: 한글에 음수 자간은 최소화. -0.1px 이하 사용 금지
- **줄 바꿈**: `word-break: keep-all` 적용 — 한글 단어 중간 줄바꿈 방지

---

## 4. Component Stylings

### Buttons

**Primary Blue (메인 CTA)**
- Background: `#0057ff` (Aircok Blue)
- Text: `#ffffff`, font-weight: 500
- Padding: 10px 20px
- Radius: 8px
- Hover: `#0040cc` (약간 어둡게)
- Active: scale(0.97)
- Focus: `2px solid #0057ff` outline + 2px offset
- 사용처: "도입 문의", "제품 보기" 등 주요 행동 유도

**Primary Dark**
- Background: `#1d1d1f`
- Text: `#ffffff`, font-weight: 500
- Padding: 10px 20px
- Radius: 8px
- 사용처: 다크 섹션의 보조 CTA

**Pill Link (자세히 보기 / Learn More)**
- Background: transparent
- Text: `#0057ff` (라이트 bg) 또는 `#3d7fff` (다크 bg)
- Radius: 980px
- Border: 1px solid currentColor
- Font: 14px–17px, weight 400
- Hover: underline
- 사용처: "자세히 보기", "더 알아보기" — Apple 시그니처 인라인 CTA

**Outline Secondary**
- Background: transparent
- Text: `#1d1d1f`
- Border: 1px solid `rgba(0,0,0,0.2)`
- Radius: 8px
- Padding: 10px 20px
- 사용처: 보조 액션 (다운로드, 카탈로그 등)

### Cards & Containers

**Product Card (라이트)**
- Background: `#f5f5f7`
- Radius: 12px
- Border: none
- Shadow: none (배경색 대비로 depth 표현)
- Padding: 24px–32px
- Hover: 미세 scale(1.01) + shadow 등장

**Product Card (다크)**
- Background: `#1a1a1a`
- Radius: 12px
- Border: none
- Shadow: 없음

**Elevated Card**
- Shadow: `rgba(0, 0, 0, 0.12) 0px 4px 24px 0px`
- 사용처: 하이라이트 제품, 팝업, 모달

### Navigation

- Background: `rgba(255, 255, 255, 0.80)` with `backdrop-filter: saturate(180%) blur(20px)` (라이트 테마)
- Height: 52px
- Logo: Aircok 로고 좌측 정렬
- Links: 15px, weight 400, `rgba(0,0,0,0.80)`
- CTA 버튼: "도입 문의" — Aircok Blue, 8px radius, 8px 16px padding
- Mobile: 834px 이하에서 햄버거 메뉴
- Sticky: 스크롤 시 유지, 상단에 항상 노출

### Hero Section

- Full-viewport-width, 배경 `#f5f5f7` 또는 `#0a0a0a`
- 헤드라인: 56px, weight 600, line-height 1.07
- 서브 카피: 21px, weight 400, line-height 1.19
- CTA 2개 나란히: "도입 문의" (Filled Blue) + "제품 보기" (Pill Outline)
- 제품 이미지: 하단 또는 우측, 솔리드 배경 위

### Product Grid Tile

- 정사각형 또는 근사 정사각형 카드
- 제품 이미지: 카드 면적 60–70% 차지
- 제품명 + 한 줄 설명
- 하단 "자세히 보기" 링크 (Pill Link)
- 배경: 라이트 `#f5f5f7` / 다크 `#1a1a1a` 교차

### Feature Strip (기능 특징)

- 아이콘 + 제목 + 설명 3–4열 그리드
- 아이콘: 라인 스타일, Aircok Blue
- 제목: 21px, weight 600
- 설명: 17px, weight 400, `rgba(0,0,0,0.80)`

**Feature Strip (다크 배경 카드 변형)**

아이콘 없이 제목 + 설명만으로 구성되는 다크 섹션용 특징 카드.

- 섹션 배경: `bg-surface-dark`
- 카드 배경: `bg-surface-dark-1` (radius: `rounded-xl`, 패딩: `p-6`)
- **제목**: Card Title (21px, weight 700), `text-heading-light`
- **설명**: Body (17px, weight 400), `text-body-light`, `leading-[1.65]`, `[word-break:keep-all]`
- 그리드: 4열(데스크탑, `lg:grid-cols-4`) → 2열(태블릿, `sm:grid-cols-2`) → 1열(모바일)
- 카드 간 그림자 없음 (다크 섹션 내부 elevation은 배경색 차이로만 표현)

```tsx
// Feature Strip 다크 카드 예시
<div className="bg-surface-dark-1 rounded-xl p-6 flex flex-col gap-3">
  <h3 className="text-[21px] font-bold text-heading-light leading-[1.19]">카드 제목</h3>
  <p className="text-[17px] text-body-light leading-[1.65] [word-break:keep-all]">카드 설명 텍스트</p>
</div>
```

**Bottom CTA Section**

라이트 배경의 마지막 CTA 섹션.

- 섹션 배경: `bg-surface-light`
- 레이아웃: 중앙 정렬(`text-center`), 상하 패딩 `py-20`
- **H2**: Section Heading (40px, weight 600), `text-heading-dark`, `leading-[1.10]`, `tracking-[-0.3px]`
- **본문 p**: Body (17px, weight 400), `text-body-dark`, `leading-[1.65]`, `[word-break:keep-all]`
- **CTA 행**: Primary Blue 버튼 + "or" 텍스트(`text-secondary-dark`) + 전화번호 링크(`text-aircok-blue`)
- 전화번호 링크: `<a href="tel:...">`, `text-aircok-blue`, `font-medium`
- 섹션 상단에 얇은 구분선(`border-t border-border-light`) 선택적 사용

```tsx
// Bottom CTA Section 예시 구조
<section className="bg-surface-light border-t border-border-light">
  <div className="max-w-[1200px] mx-auto px-5 py-20 flex flex-col items-center gap-6 text-center">
    <h2 className="text-[40px] font-semibold text-heading-dark leading-[1.10] tracking-[-0.3px] [word-break:keep-all]">헤딩</h2>
    <p className="text-[17px] text-body-dark leading-[1.65] [word-break:keep-all]">본문</p>
    <div className="flex items-center gap-4 flex-wrap justify-center">
      <button className="bg-aircok-blue text-heading-light text-[17px] font-medium rounded-md px-5 py-[10px] hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors">버튼</button>
      <span className="text-secondary-dark text-[17px]">or</span>
      <a href="tel:..." className="text-aircok-blue text-[17px] font-medium">전화번호</a>
    </div>
  </div>
</section>
```

### Full-Blue CTA Section (풀 블루 CTA 섹션)

마지막 CTA 섹션의 강조 변형. 섹션 전체를 Aircok Blue로 채워 강한 행동 유도. 기존 Bottom CTA Section(라이트 배경)과 구별.

- 섹션 배경: `bg-aircok-blue`
- 구분선: 없음
- **H2**: `text-heading-light text-3xl font-display font-semibold text-center leading-[1.10] tracking-[-0.3px] [word-break:keep-all]`
- **본문 p**: `text-heading-light opacity-80 text-[17px] leading-[1.65] [word-break:keep-all]`
- **CTA 버튼**: `bg-surface-white text-aircok-blue rounded-md px-8 py-3 font-medium hover:bg-surface-light active:scale-[0.97] transition-colors min-h-[44px]`
- **전화번호**: `text-heading-light opacity-80 text-sm hover:opacity-100 transition-opacity` (`<a href="tel:...">`)
- 레이아웃: `flex flex-col items-center gap-8 text-center py-20`

```tsx
// Full-Blue CTA Section 예시
<section className="bg-aircok-blue">
  <div className="max-w-[1200px] mx-auto px-5 py-20 flex flex-col items-center gap-8 text-center">
    <h2 className="text-heading-light text-3xl font-display font-semibold text-center leading-[1.10] tracking-[-0.3px] [word-break:keep-all]">헤딩</h2>
    <p className="text-heading-light opacity-80 text-[17px] leading-[1.65] [word-break:keep-all] max-w-[640px]">본문</p>
    <a href="/contact" className="bg-surface-white text-aircok-blue rounded-md px-8 py-3 font-medium hover:bg-surface-light active:scale-[0.97] transition-colors min-h-[44px] inline-flex items-center justify-center">버튼</a>
    <a href="tel:..." className="text-heading-light opacity-80 text-sm hover:opacity-100 transition-opacity">전화번호</a>
  </div>
</section>
```

### Corporate Footer Block (법인 정보 푸터 블록)

전사 Footer의 하단 파트. 법인 등록 정보·연락처·소셜·저작권을 담는 다크 섹션.

- 섹션 배경: `bg-surface-dark`
- 최대 너비·패딩: `max-w-[1200px] mx-auto px-5 py-10`

**레이아웃 구조 (3행)**

행 1 — 상단 행: 좌측 회사명(법인명), 우측 소셜 링크
- 회사명(법인명): `text-heading-light font-display font-semibold text-base`
- 소셜 링크: `text-body-light text-sm hover:text-heading-light transition-colors`

행 2 — 법인 정보 그리드 (2열, `sm:grid-cols-2`):
- 좌열: 대표 | 사업자등록번호 | 통신판매업신고번호 | 주소
- 우열: 전화 | 팩스 | 이메일
- 레이블: `text-body-light opacity-40 text-xs mr-2`
- 값: `text-body-light text-xs`

행 3 — 구분선 + 저작권
- 구분선: `border-t border-border-dark`
- 저작권: `text-body-light opacity-60 text-xs`

```tsx
// Corporate Footer Block 예시
<div className="bg-surface-dark">
  <div className="max-w-[1200px] mx-auto px-5 py-10">
    {/* 상단 행: 회사명 + 소셜 */}
    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
      <p className="text-heading-light font-display font-semibold text-base">
        (주)에어코크
      </p>
      <div className="flex items-center gap-4">
        <a href="https://instagram.com/..." target="_blank" rel="noopener noreferrer"
           className="text-body-light text-sm hover:text-heading-light transition-colors">
          Instagram
        </a>
        {/* YouTube, LinkedIn 동일 패턴 */}
      </div>
    </div>

    {/* 법인 정보 그리드 */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
      <div className="flex flex-col gap-1.5">
        <p className="text-body-light text-xs">
          <span className="opacity-40 mr-2">대표</span>조흔우
        </p>
        <p className="text-body-light text-xs">
          <span className="opacity-40 mr-2">사업자등록번호</span>689-87-00920
        </p>
        <p className="text-body-light text-xs">
          <span className="opacity-40 mr-2">통신판매업신고번호</span>2020-서울성동-02120
        </p>
        <p className="text-body-light text-xs">
          <span className="opacity-40 mr-2">주소</span>서울특별시 성동구 ...
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-body-light text-xs">
          <span className="opacity-40 mr-2">전화</span>02-6952-1947
        </p>
        <p className="text-body-light text-xs">
          <span className="opacity-40 mr-2">팩스</span>02-552-1948
        </p>
        <p className="text-body-light text-xs">
          <span className="opacity-40 mr-2">이메일</span>aircok@aircok.com
        </p>
      </div>
    </div>

    {/* 저작권 */}
    <div className="border-t border-border-dark pt-5">
      <p className="text-body-light opacity-60 text-xs">
        © 2025 스마트에어콕. All rights reserved.
      </p>
    </div>
  </div>
</div>
```

### Case Study Card (도입 사례)

- 이미지 상단, 텍스트 하단
- 고객사명 (캡션, weight 600)
- 성과 수치 강조 (28px, weight 600, Aircok Blue)
- 설명 1–2줄

### Location Pin Icon (장소 핀 아이콘) — 공통 SVG

뉴스 카드·가로형 row·상세 히어로 등에서 `location`을 표시할 때 사용하는 인라인 SVG 핀 아이콘. **📍 이모지 사용 금지** — 반드시 아래 SVG로 표시한다. 색상은 `currentColor`로 부모 텍스트 색을 상속하며, 라이트/다크 배경 모두에서 동작한다.

- 권장 크기: 캡션/메타에서는 `w-3.5 h-3.5`, 본문 메타에서는 `w-4 h-4`
- `aria-hidden="true"`, `shrink-0` 권장 (텍스트와 `inline-flex items-center gap-1`로 배치)
- 색상: 부모가 `text-secondary-dark`/`text-body-light` 등이면 핀도 동일 색을 상속

```tsx
// Location Pin SVG (currentColor 상속, 외곽선 스타일)
<svg
  className="w-3.5 h-3.5 shrink-0"
  aria-hidden="true"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  strokeWidth="1.5"
>
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
</svg>
```

장소 표기 마크업 패턴 (라이트 배경 캡션):

```tsx
<span className="inline-flex items-center gap-1 text-secondary-dark text-xs">
  <svg className="w-3.5 h-3.5 shrink-0" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
  {location}
</span>
```

### Image Placeholder (빈 커버 이미지 플레이스홀더) — 공통

`coverImage`가 없을 때 표시하는 빈 이미지 영역. 카드·row·hero 등 모든 뉴스 표면에서 동일한 시각 언어를 사용한다.

- 라이트 변형: `bg-surface-light flex items-center justify-center` + 아이콘 `text-secondary-dark`
- 다크 변형: `bg-surface-dark-1 flex items-center justify-center` + 아이콘 `text-body-light opacity-40`
- 컨테이너의 `aspect-*` 비율은 사용처(카드=`aspect-video`, row 썸네일=`aspect-row-thumb`, hero=`aspect-featured`)를 따른다
- 아이콘 크기: 소형(row 썸네일) `w-6 h-6`, 대형(hero) `w-10 h-10`

```tsx
// Image Placeholder SVG (image-off 스타일 외곽선 아이콘)
<div className="aspect-video bg-surface-light flex items-center justify-center">
  <svg className="w-6 h-6 text-secondary-dark" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
  </svg>
</div>
```

### News Card (뉴스 카드)

뉴스 목록 페이지에서 3열 그리드로 배치되는 카드. 커버 이미지 + 텍스트 구조. 매거진형 레이아웃에서는 **보조 2열 그리드**의 기본 단위로도 사용한다.

- 카드 래퍼: `bg-surface-white rounded-xl shadow-card overflow-hidden hover:shadow-product hover:-translate-y-1 transition-all duration-200`
- 커버 이미지: `aspect-video w-full object-cover`
- 이미지 없음 플레이스홀더: 위 **Image Placeholder** 라이트 변형(`aspect-video bg-surface-light ...`) 사용
- 하단 패딩: `p-6`
- **날짜**: `text-aircok-blue text-xs font-body tracking-wide` (Aircok Blue — 날짜가 카테고리/레이블 역할)
- **카드 제목**: `text-heading-dark font-display font-semibold text-[18px] leading-snug mt-2` (Card News Title, 18px)
- **설명**: `text-body-dark text-sm font-body line-clamp-2 mt-2`
- **장소**: 위 **Location Pin Icon** 패턴 사용, `mt-3` (있을 때만, 📍 이모지 금지)
- **"자세히 보기 →"**: `text-aircok-blue text-sm font-body mt-4 inline-block`

```tsx
// News Card 예시
<Link href={`/news/${item.id}`} className="block group">
  <article className="bg-surface-white rounded-xl shadow-card overflow-hidden hover:shadow-product hover:-translate-y-1 transition-all duration-200">
    <img src="..." alt="..." className="aspect-video w-full object-cover" />
    <div className="p-6">
      <time className="text-aircok-blue text-xs font-body tracking-wide">2025.01.01</time>
      <h2 className="text-heading-dark font-display font-semibold text-[18px] leading-snug mt-2">카드 제목</h2>
      <p className="text-body-dark text-sm font-body line-clamp-2 mt-2">설명 텍스트</p>
      <span className="inline-flex items-center gap-1 text-secondary-dark text-xs mt-3">
        <svg className="w-3.5 h-3.5 shrink-0" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        장소
      </span>
      <span className="text-aircok-blue text-sm font-body mt-4 inline-block">자세히 보기 →</span>
    </div>
  </article>
</Link>
```

### News Horizontal Row (가로형 리스트 row)

매거진형 목록에서 featured hero 아래에 배치하는 가로형 기사 row. 좌측 썸네일 + 우측 텍스트 2단 구성. 라이트/다크 섹션 모두에 사용할 수 있도록 두 변형을 정의한다. 데스크탑은 좌우 분할, 모바일(`< sm`)에서는 썸네일이 위로 가는 세로 스택으로 폴백한다.

**공통 구조**
- 래퍼: `group flex flex-col sm:flex-row gap-5 sm:gap-6 items-start`
- 썸네일 영역: `w-full sm:w-[280px] shrink-0 rounded-lg overflow-hidden` (`sm:w-[280px]` {/* token 없음: row 썸네일 고정 너비, 매거진 가로형 전용 1회성 수치 */})
- 썸네일 이미지: `aspect-row-thumb w-full object-cover group-hover:scale-[1.02] transition-transform duration-200`
- 썸네일 없음: Image Placeholder(`aspect-row-thumb` 적용) — 라이트 섹션은 라이트 변형, 다크 섹션은 다크 변형
- 텍스트 영역: `flex flex-col gap-2 min-w-0 flex-1`
- 날짜: `text-aircok-blue text-xs font-body tracking-wide`
- 제목: `font-display font-semibold text-[21px] leading-snug [word-break:keep-all]` (Card Title 수준, hover 시 색 변화 없음 — 카드 전체 hover는 썸네일 scale로만)
- 설명: `text-sm font-body line-clamp-2 [word-break:keep-all]`
- 장소: Location Pin Icon 패턴, `text-xs mt-1`

**라이트 변형** (`bg-surface-white` / `bg-surface-light` 섹션)
- 제목: `text-heading-dark`
- 설명: `text-body-dark`
- 장소: `text-secondary-dark`
- 썸네일 placeholder: Image Placeholder 라이트 변형

**다크 변형** (`bg-surface-dark` 섹션)
- 날짜: `text-aircok-blue-light` (다크 배경 가독성)
- 제목: `text-heading-light`
- 설명: `text-body-light`
- 장소: `text-body-light opacity-60`
- 썸네일 placeholder: Image Placeholder 다크 변형

```tsx
// News Horizontal Row 예시 (라이트 변형)
<Link href={`/news/${item.id}`} className="block">
  <article className="group flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
    {/* 썸네일 (고정 너비) */}
    <div className="w-full sm:w-[280px] shrink-0 rounded-lg overflow-hidden"> {/* token 없음: row 썸네일 고정 너비 280px */}
      <img src="..." alt="..." className="aspect-row-thumb w-full object-cover group-hover:scale-[1.02] transition-transform duration-200" />
    </div>
    {/* 텍스트 */}
    <div className="flex flex-col gap-2 min-w-0 flex-1">
      <time className="text-aircok-blue text-xs font-body tracking-wide">2025.01.01</time>
      <h3 className="font-display font-semibold text-[21px] leading-snug text-heading-dark [word-break:keep-all]">기사 제목</h3>
      <p className="text-sm font-body line-clamp-2 text-body-dark [word-break:keep-all]">설명 텍스트</p>
      <span className="inline-flex items-center gap-1 text-secondary-dark text-xs mt-1">
        <svg className="w-3.5 h-3.5 shrink-0" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        장소
      </span>
    </div>
  </article>
</Link>
```

### News Featured Hero (매거진 대표 기사)

목록 페이지 최상단에 대표 기사 1건을 대형으로 노출하는 매거진형 히어로. 두 가지 변형을 정의하며, implementer가 `coverImage` 유무·디자인 의도에 따라 선택한다. **두 변형 모두 `coverImage`가 없으면 텍스트 분리형으로 폴백**한다.

#### 변형 (1) Overlay 변형 — 이미지 위 텍스트 오버레이

큰 커버 이미지 위에 `bg-overlay-dark-60`(기존 토큰 재활용)을 깔고 흰 텍스트를 오버레이한다. 신규 색상 토큰 없음.

- 래퍼: `relative rounded-xl overflow-hidden group`
- 이미지: `aspect-featured w-full object-cover` (16/7 와이드)
- 오버레이: `absolute inset-0 bg-overlay-dark-60` (텍스트 대비 확보)
- 텍스트 블록: `absolute inset-0 flex flex-col justify-end p-8 md:p-12 gap-3`
- 날짜: `text-aircok-blue-light text-xs font-body tracking-widest uppercase` (다크 위 가독성)
- 제목: `text-heading-light font-display font-bold text-[28px] md:text-[40px] leading-[1.10] tracking-[-0.3px] max-w-3xl [word-break:keep-all]`
- 설명: `text-body-light font-body text-base md:text-lg line-clamp-2 max-w-2xl [word-break:keep-all]`
- 장소: Location Pin Icon, `text-body-light opacity-80 text-xs`
- 이미지 hover(선택): `group-hover:scale-[1.02] transition-transform duration-300` (이미지에만)

```tsx
// News Featured Hero — Overlay 변형
<Link href={`/news/${item.id}`} className="block">
  <article className="relative rounded-xl overflow-hidden group">
    <img src="..." alt="..." className="aspect-featured w-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
    <div className="absolute inset-0 bg-overlay-dark-60" />
    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 gap-3">
      <time className="text-aircok-blue-light text-xs font-body tracking-widest uppercase">2025.01.01</time>
      <h2 className="text-heading-light font-display font-bold text-[28px] md:text-[40px] leading-[1.10] tracking-[-0.3px] max-w-3xl [word-break:keep-all]">대표 기사 제목</h2>
      <p className="text-body-light font-body text-base md:text-lg line-clamp-2 max-w-2xl [word-break:keep-all]">설명 텍스트</p>
    </div>
  </article>
</Link>
```

#### 변형 (2) 텍스트 분리형 — 좌우 split

이미지와 텍스트를 좌우로 분리한다. 라이트 섹션에서 사용. `coverImage` 없을 때의 폴백이기도 하다(이 경우 이미지 칼럼 자리에 Image Placeholder 또는 텍스트 단독 풀폭).

- 래퍼: `grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center`
- 이미지 칼럼: `rounded-xl overflow-hidden` + 이미지 `aspect-video w-full object-cover` (이미지 없으면 Image Placeholder 라이트, `aspect-video`)
- 텍스트 칼럼: `flex flex-col gap-4`
- 날짜: `text-aircok-blue text-xs font-body tracking-widest uppercase`
- 제목: `text-heading-dark font-display font-bold text-[32px] md:text-[40px] leading-[1.10] tracking-[-0.3px] [word-break:keep-all]`
- 설명: `text-body-dark font-body text-lg line-clamp-3 [word-break:keep-all]`
- 장소: Location Pin Icon, `text-secondary-dark text-xs`
- 하단 "자세히 보기 →": `text-aircok-blue text-sm font-body mt-2 inline-block`

```tsx
// News Featured Hero — 텍스트 분리형
<Link href={`/news/${item.id}`} className="block group">
  <article className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
    <div className="rounded-xl overflow-hidden">
      <img src="..." alt="..." className="aspect-video w-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
    </div>
    <div className="flex flex-col gap-4">
      <time className="text-aircok-blue text-xs font-body tracking-widest uppercase">2025.01.01</time>
      <h2 className="text-heading-dark font-display font-bold text-[32px] md:text-[40px] leading-[1.10] tracking-[-0.3px] [word-break:keep-all]">대표 기사 제목</h2>
      <p className="text-body-dark font-body text-lg line-clamp-3 [word-break:keep-all]">설명 텍스트</p>
      <span className="text-aircok-blue text-sm font-body mt-2 inline-block">자세히 보기 →</span>
    </div>
  </article>
</Link>
```

### News Detail Hero (뉴스 상세 히어로)

뉴스 상세 페이지 상단 히어로. 두 변형을 정의한다. `coverImage`가 있으면 목록 featured hero와 통일감을 주는 **Overlay 변형**을, 없으면 기존 **라이트 변형**을 폴백으로 사용한다.

#### 변형 A — 라이트 변형 (coverImage 없음, 폴백)

날짜/장소 뱃지 + H1 + 설명 구조.

- 배경 섹션: `bg-surface-light py-14`
- 날짜·장소 뱃지: `bg-surface-white rounded-pill px-3 py-1 text-xs text-secondary-dark border border-border-light` (장소 뱃지는 Location Pin Icon을 `inline-flex items-center gap-1`로 포함)
- **H1 (데스크탑)**: Article Hero (48px, weight 700), `text-heading-dark font-display font-bold md:text-[48px] leading-tight [word-break:keep-all]`
- **H1 (모바일)**: Article Hero Mobile (36px, weight 700), `text-[36px]` (responsive 적용)
- **설명 p**: Body (17px, weight 400), `text-body-dark font-body text-lg mt-4 max-w-2xl [word-break:keep-all]`
- 클래스 조합: `text-[36px] md:text-[48px]`

#### 변형 B — Overlay 변형 (coverImage 있음, 목록 featured hero와 통일)

커버 이미지를 full-bleed로 깔고 `bg-overlay-dark-60` 위에 흰 텍스트를 배치. 목록 페이지의 News Featured Hero(Overlay) 변형과 동일한 비주얼 언어로 목록↔상세 통일감을 만든다. 신규 색상 토큰 없이 기존 `bg-overlay-dark-60` 재활용.

- 섹션 래퍼: `relative` (full-width 섹션)
- 이미지: `aspect-featured w-full object-cover` (모바일은 비율이 너무 납작하면 `max-h-[520px]`로 캡 가능 — 기존 상세에서 쓰던 수치)
- 오버레이: `absolute inset-0 bg-overlay-dark-60`
- 콘텐츠 컨테이너: `absolute inset-0 flex items-end` 내부에 `content-container` + `pb-10 md:pb-14`
- 날짜·장소 뱃지: `bg-overlay-white-10 backdrop-blur-sm rounded-pill px-3 py-1 text-xs text-body-light border border-border-dark` (다크 위 글래스 뱃지, 기존 `bg-overlay-white-10`/`border-border-dark` 토큰 재활용)
- **H1**: `text-heading-light font-display font-bold text-[36px] md:text-[48px] leading-tight max-w-3xl [word-break:keep-all]`
- **설명 p**: `text-body-light font-body text-lg mt-4 max-w-2xl [word-break:keep-all]`

```tsx
// News Detail Hero — Overlay 변형 (coverImage 있을 때)
<section className="relative">
  <img src="..." alt={post.title} className="aspect-featured w-full object-cover max-h-[640px]" /> {/* token 없음: overlay hero 모바일 높이 캡 */}
  <div className="absolute inset-0 bg-overlay-dark-60" />
  <div className="absolute inset-0 flex items-end">
    <div className="content-container pb-10 md:pb-14 w-full">
      <div className="flex items-center gap-2 flex-wrap">
        <time className="bg-overlay-white-10 backdrop-blur-sm rounded-pill px-3 py-1 text-xs text-body-light border border-border-dark">2025.01.01</time>
        <span className="inline-flex items-center gap-1 bg-overlay-white-10 backdrop-blur-sm rounded-pill px-3 py-1 text-xs text-body-light border border-border-dark">
          <svg className="w-3.5 h-3.5 shrink-0" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          장소
        </span>
      </div>
      <h1 className="text-heading-light font-display font-bold text-[36px] md:text-[48px] leading-tight mt-4 max-w-3xl [word-break:keep-all]">기사 제목</h1>
      <p className="text-body-light font-body text-lg mt-4 max-w-2xl [word-break:keep-all]">설명 텍스트</p>
    </div>
  </div>
</section>
```

> **뒤로가기 바**: Overlay 변형 위에 뒤로가기 링크를 둘 경우, 다크 이미지 위 가독성을 위해 `text-body-light hover:text-heading-light` 변형을 사용한다(라이트 변형에서는 기존 `text-secondary-dark hover:text-body-dark` 유지).

### News Magazine Layout (매거진형 목록 페이지 구성)

뉴스 목록 페이지(`/news`)의 전체 섹션 리듬. §1/§7 섹션 교차 원칙을 따라 라이트↔다크 섹션을 교차해 시네마틱 리듬을 만든다. 카테고리/태그 분류는 도입하지 않으며, 가용 데이터(id·title·description·date·location·coverImage)만 사용한다.

**섹션 순서·배경 리듬**

> **연도 필터 적용 시**: Featured 섹션의 페이지 타이틀 바로 아래에 **News Year Filter Tab**(아래 패턴 참조)을 배치하고, 선택된 연도(또는 "전체")에 해당하는 기사 집합으로 featured + row + grid를 재구성한다. 즉 필터링된 목록의 첫 기사가 featured(맨 위 대형)가 되고, 나머지가 row/grid 섹션으로 분배된다. 탭은 라이트 Featured 섹션 안에 있으므로 라이트 변형만 사용한다.

1. **Featured 섹션** (`bg-surface-light py-16 md:py-20`) — 상단 페이지 레이블(`text-aircok-blue ... uppercase` NEWS) + 페이지 타이틀(H1, Section Heading) 후, (연도 필터 사용 시 News Year Filter Tab을 배치한 뒤) 대표 기사 1건을 **News Featured Hero**로 노출. 데이터 1건일 때는 featured만 렌더.
2. **주요 기사 row 섹션** (`bg-surface-white py-16`) — 다음 N건(예: 2~5번째)을 **News Horizontal Row 라이트 변형**으로 세로 나열. row 사이 구분선: `divide-y divide-border-light`(각 row에 상하 패딩 `py-8`).
3. **보조 그리드 섹션** (`bg-surface-dark py-16 md:py-20`) — 나머지 기사를 **News Horizontal Row 다크 변형**으로 2열(`md:grid-cols-2`)로 배치. 다크 섹션이므로 카드 대신 다크 row를 사용한다. 이 섹션이 라이트↔다크 교차 리듬을 완성한다.
4. (선택) 기사 수가 많을 때 라이트/다크 교차를 한 번 더 반복.

- 각 섹션 내부 콘텐츠는 반드시 `content-container` 사용.
- 빈 상태: 데이터 0건이면 Featured 섹션 자리에 빈 상태 메시지(`py-24 text-center` + `text-secondary-dark`).
- 모바일에서는 모든 그리드/row가 1열로 폴백.

```tsx
// News Magazine Layout 골격 (구성만 — 데이터 분배는 implementer)
<main className="min-h-screen bg-surface-white">
  {/* 1. Featured (라이트) */}
  <section className="bg-surface-light py-16 md:py-20">
    <div className="content-container flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <p className="text-aircok-blue text-sm font-body tracking-widest uppercase">NEWS</p>
        <h1 className="text-[40px] font-display font-semibold text-heading-dark leading-[1.10] tracking-[-0.3px] [word-break:keep-all]">페이지 타이틀</h1>
      </div>
      {/* News Featured Hero (overlay 또는 텍스트 분리형) */}
    </div>
  </section>

  {/* 2. 주요 기사 row (라이트 화이트) */}
  <section className="bg-surface-white py-16">
    <div className="content-container flex flex-col divide-y divide-border-light">
      {/* News Horizontal Row 라이트 변형 * N (각 row에 py-8) */}
    </div>
  </section>

  {/* 3. 보조 그리드 (다크) */}
  <section className="bg-surface-dark py-16 md:py-20">
    <div className="content-container grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
      {/* News Horizontal Row 다크 변형 * N */}
    </div>
  </section>
</main>
```

### News Year Filter Tab (연도별 필터 탭)

뉴스 매거진 목록(`/news`) 상단에서 연도(year)를 기준으로 기사를 필터링하는 타임라인형 탭. 카테고리/태그 분류가 아니라 **연도 단일 축** 필터다. 사용자가 연도를 "시간축"처럼 인지하도록, §8 "Category Tab"의 pill 스타일을 기반으로 하되 연도 항목 사이에 미세한 축 구분선을 더해 타임라인 맥락을 부여한다. 색상은 §8 / §4.5 History Timeline과 동일하게 **Aircok Blue 단일**만 사용하며 신규 색상 토큰은 도입하지 않는다.

> **클라이언트 인터랙션**: 탭 선택 상태와 onChange 핸들링이 필요하므로 이 탭을 포함하는 컴포넌트(또는 그 부모)는 `'use client'` 컴포넌트여야 한다. 선택 상태(`selectedYear`)와 필터링·featured 재배치 로직은 frontend-implementer가 담당하며, 본 가이드는 탭 UI 마크업·상태 클래스만 정의한다.

**항목 구성**
- 첫 항목은 항상 **"전체"**(value: `'all'`).
- 이후 항목은 **데이터에 존재하는 연도들**을 `date`(ISO)에서 추출해 **중복 제거 + 내림차순(최신 연도 우선)** 정렬. 예: `[전체, 2026, 2025, 2024]`.
- 연도 라벨은 4자리 숫자 문자열(`2026`) 그대로 표시. 숫자 정렬·정렬 안정성을 위해 라벨에 `tabular-nums` 적용.

**리스트 컨테이너 (§8 Category Tab 재활용 + 타임라인 변형)**
- §8 Category Tab과 동일한 수평 스크롤 컨테이너를 사용: `flex flex-row items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`
- **타임라인 축 표현(선택, 권장)**: "전체" 칩과 연도 칩 그룹 사이를 시각적으로 분리하기 위해 얇은 세로 구분선 1개(`<span aria-hidden="true" className="shrink-0 w-px h-5 bg-border-light mx-1" />`)를 둘 수 있다. 신규 토큰 없이 기존 `bg-border-light` 재활용. 칩마다 구분선을 반복하지는 않는다(과한 장식 금지).
- `role="tablist"` + `aria-label="연도별 필터"` 를 컨테이너에 부여.

**탭 버튼 — 활성 상태** (§8 Category Tab 활성 그대로)
- `shrink-0 rounded-pill px-5 py-2 min-h-[44px] text-[15px] font-medium bg-aircok-blue text-heading-light transition-colors tabular-nums`
- `role="tab"`, `aria-selected={true}`

**탭 버튼 — 비활성 상태** (§8 Category Tab 비활성 그대로)
- `shrink-0 rounded-pill px-5 py-2 min-h-[44px] text-[15px] font-medium bg-transparent text-body-dark hover:bg-surface-light transition-colors tabular-nums`
- `role="tab"`, `aria-selected={false}`
- 키보드 포커스: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2`

**카운트 배지 (선택 — 권장)**
연도별 기사 수를 칩 우측에 표시하면 타임라인 밀도(어느 해에 기사가 많은지)를 직관적으로 전달한다. §8 FAQ Sidebar 카운트 배지 톤을 인라인 pill로 재활용한다. 칩이 가로 스크롤 영역이므로 `ml-auto` 대신 `ml-1.5`로 라벨 옆에 붙인다.
- 비활성 칩의 배지: `text-[12px] text-secondary-dark bg-surface-light rounded-pill px-1.5 py-0.5 ml-1.5 tabular-nums`
- 활성 칩의 배지(파란 배경 위 가독성): 배경 없이 `text-[12px] text-heading-light/70 ml-1.5 tabular-nums` — 기존 `text-heading-light` opacity 변형(신규 토큰 아님). 또는 `bg-overlay-white-10 rounded-pill px-1.5 py-0.5` 글래스 배지로 대체 가능.
- 배지는 칩 라벨과 함께 한 버튼 내부에 둔다(별도 클릭 대상 아님). 배지에는 `aria-hidden="true"`를 부여하고, 칩 라벨에 스크린리더용 설명을 포함(예: `aria-label="2025년 기사 12건"`).
- **권장/선택 명시**: 카운트 배지는 **선택 사항**이다. 기사 수가 적거나 연도 수가 많아 가로 폭이 빠듯하면 생략한다. 도입할 경우 "전체" 칩에도 총 기사 수 배지를 동일 톤으로 붙여 일관성을 유지한다.

**접근성 (a11y)**
- 컨테이너: `role="tablist"`, `aria-label="연도별 필터"`.
- 각 칩: `role="tab"`, `aria-selected`(활성=`true`/비활성=`false`), `type="button"`.
- 선택 시 보여지는 목록 영역에는 `role="tabpanel"`을 부여하고, 활성 탭과 `aria-labelledby`/`id`로 연결하는 것을 권장(목록 패널은 implementer 구현 범위).
- 키보드: 좌우 화살표로 탭 이동(implementer), 포커스 링은 `focus-visible:ring-2 focus-visible:ring-aircok-blue`.
- 터치 타깃: 모든 칩 `min-h-[44px]` 보장(§10 Touch Targets).
- 모바일 overflow: 컨테이너 `overflow-x-auto` + 칩 `shrink-0`로 가로 스크롤. 스크롤바는 위 유틸리티로 숨김.

```tsx
// News Year Filter Tab 예시 ('use client' 컴포넌트 내부)
// years: 내림차순 정렬된 연도 배열 (예: [2026, 2025, 2024]), 추출·정렬은 implementer
// selectedYear: 'all' | number,  counts: Record<'all' | number, number> (선택)
<div
  role="tablist"
  aria-label="연도별 필터"
  className="flex flex-row items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
>
  {/* "전체" 칩 (활성 예시) */}
  <button
    type="button"
    role="tab"
    aria-selected={selectedYear === 'all'}
    aria-label={`전체 기사 ${counts.all}건`}
    onClick={() => onSelectYear('all')}
    className="shrink-0 rounded-pill px-5 py-2 min-h-[44px] text-[15px] font-medium bg-aircok-blue text-heading-light transition-colors tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2"
  >
    전체
    <span aria-hidden="true" className="text-[12px] text-heading-light/70 ml-1.5 tabular-nums">{counts.all}</span>
  </button>

  {/* 타임라인 축 구분선 (선택, 권장) */}
  <span aria-hidden="true" className="shrink-0 w-px h-5 bg-border-light mx-1" />

  {/* 연도 칩 (비활성 예시) */}
  {years.map((year) => (
    <button
      key={year}
      type="button"
      role="tab"
      aria-selected={selectedYear === year}
      aria-label={`${year}년 기사 ${counts[year]}건`}
      onClick={() => onSelectYear(year)}
      className={
        selectedYear === year
          ? 'shrink-0 rounded-pill px-5 py-2 min-h-[44px] text-[15px] font-medium bg-aircok-blue text-heading-light transition-colors tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2'
          : 'shrink-0 rounded-pill px-5 py-2 min-h-[44px] text-[15px] font-medium bg-transparent text-body-dark hover:bg-surface-light transition-colors tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2'
      }
    >
      {year}
      {/* 카운트 배지 — 선택. 활성/비활성 톤 분기 */}
      <span
        aria-hidden="true"
        className={
          selectedYear === year
            ? 'text-[12px] text-heading-light/70 ml-1.5 tabular-nums'
            : 'text-[12px] text-secondary-dark bg-surface-light rounded-pill px-1.5 py-0.5 ml-1.5 tabular-nums'
        }
      >
        {counts[year]}
      </span>
    </button>
  ))}
</div>
```

> **재활용 메모**: 본 탭은 §8 Category Tab의 활성/비활성 칩 클래스를 그대로 사용하므로, 향후 두 패턴을 묶어 `shared/ui`의 단일 `<FilterTabs>` 공용 컴포넌트로 추출하는 것을 검토할 수 있다(연도 필터 + FAQ 카테고리 필터 = 2곳, 3곳째 등장 시 추출). 현 단계에서는 가이드만 정의한다.

### News Content (Rich Text 렌더러)

TipTap 등 rich text 에디터의 HTML 출력을 렌더링하는 스타일 가이드.

- 기본 텍스트: `text-body-dark font-body text-[17px] leading-[1.65]`, `style={{ wordBreak: 'keep-all' }}`
- `[&_h2]`: Section Heading 수준 — `text-heading-dark font-display font-semibold text-[28px] mt-12 mb-4`
- `[&_h3]`: Article Sub-heading (22px) — `text-heading-dark font-display font-semibold text-[22px] mt-8 mb-3`
- `[&_p]`: `mb-5`
- `[&_ul]`, `[&_ol]`: `list-disc / list-decimal pl-6 mb-5`
- `[&_li]`: `mb-2`
- `[&_strong]`: `font-semibold text-heading-dark`
- `[&_img]`: `rounded-xl w-full my-8 shadow-card`
- `[&_a]`: `text-aircok-blue hover:underline`

### Stat Card (통계 카드)

통계·수치 데이터를 강조하는 정보 카드. `StatSection`에서 4열 그리드로 배치.

- 배경: `bg-surface-white`
- 테두리: `border border-border-light`
- Radius: `rounded-lg` (12px)
- 패딩: `p-6` (32px)
- **category 레이블**: 12px (Micro), weight 600, `text-aircok-blue`, `uppercase`, letter-spacing 약간 (`tracking-wide`)
- **title 헤드라인**: 21px (Card Title), weight 700, `text-heading-dark`
- **description**: 17px (Body), weight 400, `text-body-dark`, `word-break: keep-all`
- **source (출처)**: 12px (Micro), weight 400, `text-secondary-dark`, italic
- 그리드: 4열(데스크탑) → 2열(태블릿, `sm:grid-cols-2`) → 1열(모바일)

```tsx
// Stat Card 예시
<div className="bg-surface-white border border-border-light rounded-lg p-6">
  <p className="text-[12px] font-semibold text-aircok-blue uppercase tracking-wide">category</p>
  <h3 className="text-[21px] font-bold text-heading-dark mt-2">핵심 수치</h3>
  <p className="text-[17px] text-body-dark mt-3 leading-[1.65] [word-break:keep-all]">설명 텍스트</p>
  <p className="text-[12px] text-secondary-dark italic mt-4">출처: OOO</p>
</div>
```

### Dark Stat Card (다크 섹션 통계 카드)

라이트 Stat Card의 다크 배경 변형. `StatSection`이 `bg-surface-dark` 배경에 배치될 때 사용.

- 섹션 배경: `bg-surface-dark`
- 카드 배경: `bg-surface-dark-1`
- Radius: `rounded-xl` (16px)
- 패딩: `p-8`
- 테두리: 없음 (다크 섹션에서 배경색 대비로 depth 표현)
- **category 레이블**: 12px, weight 600, `text-aircok-blue-light` (다크 배경에서 가독성), `uppercase tracking-widest`
- **핵심 수치**: `text-5xl font-bold text-heading-light leading-none` (카드 상단에 대형 강조 수치 표시)
- **title**: 21px, weight 700, `text-heading-light`
- **description**: `text-body-light text-sm leading-[1.65] [word-break:keep-all]`
- **source (출처)**: `text-body-light opacity-50 text-xs italic` (다크 배경에서 secondary 대체)

```tsx
// Dark Stat Card 예시
<div className="bg-surface-dark-1 rounded-xl p-8 flex flex-col gap-4">
  <span className="text-aircok-blue-light text-xs font-semibold uppercase tracking-widest">category</span>
  <span className="text-5xl font-bold text-heading-light leading-none">50%</span>
  <h3 className="text-heading-light text-[21px] font-bold leading-[1.19] mt-2">핵심 수치 제목</h3>
  <p className="text-body-light text-sm leading-[1.65] [word-break:keep-all] flex-1">설명 텍스트</p>
  <p className="text-body-light opacity-50 text-xs italic mt-auto">출처</p>
</div>
```

### Step Badge (스텝 원형 배지)

프로세스/순서를 표현하는 단계 배지. `MethodologySection`의 각 스텝 헤더에 사용.

- **원형 배지**: `w-10 h-10`, `bg-aircok-blue`, `rounded-full`, 숫자 중앙 정렬(`flex items-center justify-center`)
- **배지 내 숫자**: 17px, weight 700, `text-heading-light`
- **step title**: 17px, weight 500, `text-heading-dark`
- 배지와 타이틀: `flex items-center gap-3`
- 스텝 간 구분선(선택적): 배지 사이 수평 구분 `border-b border-border-light`

```tsx
// Step Badge 예시
<div className="flex items-center gap-3">
  <div className="w-10 h-10 bg-aircok-blue rounded-full flex items-center justify-center shrink-0">
    <span className="text-[17px] font-bold text-heading-light">1</span>
  </div>
  <span className="text-[17px] font-medium text-heading-dark">스텝 제목</span>
</div>
```

### Watermark Step Card (워터마크 스텝 카드)

프로세스 단계를 카드 형태로 표현하는 변형. 배경에 대형 반투명 숫자를 워터마크로 사용. 기존 Step Badge(원형 배지)와 달리 카드 전체에 단계 정보를 배치.

- 카드 배경: `bg-surface-white` (`rounded-xl shadow-card p-8 relative`)
- **워터마크 숫자**: `text-6xl font-bold text-aircok-blue opacity-20 leading-none absolute top-6 right-6 select-none` (장식용, `aria-hidden="true"`)
- **STEP 레이블**: `text-aircok-blue text-xs font-bold uppercase tracking-widest` (예: `STEP 01`)
- **제목**: `text-heading-dark text-xl font-semibold leading-[1.14] [word-break:keep-all]`
- 배경: 섹션은 `bg-surface-white`

```tsx
// Watermark Step Card 예시
<div className="bg-surface-white rounded-xl shadow-card p-8 flex flex-col gap-4 relative">
  <span className="text-6xl font-bold text-aircok-blue opacity-20 leading-none absolute top-6 right-6 select-none" aria-hidden="true">
    1
  </span>
  <span className="text-aircok-blue text-xs font-bold uppercase tracking-widest">STEP 01</span>
  <h3 className="text-heading-dark text-xl font-semibold leading-[1.14] mt-2 [word-break:keep-all]">스텝 제목</h3>
</div>
```

### Check List Item (체크리스트 아이템)

혜택·포함 항목을 나열하는 체크리스트. `WhatYouGetSection`에서 사용.

- **체크 아이콘**: `text-aircok-blue`, `w-5 h-5`, SVG 체크마크 또는 유니코드 ✓
- **텍스트**: 17px, weight 400, `text-body-dark`, `word-break: keep-all`, `leading-[1.65]`
- 레이아웃: `flex flex-row items-start gap-3`
- 아이콘은 `shrink-0`으로 고정, 텍스트는 여러 줄 허용

```tsx
// Check List Item 예시
<li className="flex items-start gap-3">
  <svg className="w-5 h-5 text-aircok-blue shrink-0 mt-0.5" /* ... */ />
  <span className="text-[17px] text-body-dark leading-[1.65] [word-break:keep-all]">항목 텍스트</span>
</li>
```

### Filled Check Icon (원형 채움 체크 아이콘)

체크리스트 아이콘의 대안 스타일. 라인 SVG 아이콘 대신 Aircok Blue 배경의 원형 채움 배지 사용.

- 아이콘 컨테이너: `bg-aircok-blue rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5`
- 내부 체크 기호: `<span className="text-heading-light text-xs font-bold">✓</span>`
- 텍스트: 기존 Check List Item 규칙과 동일 (`text-body-dark text-[17px] leading-[1.65] [word-break:keep-all]`)
- 레이아웃: `flex items-start gap-3`

```tsx
// Filled Check Icon 아이템 예시
<li className="flex items-start gap-3">
  <span className="bg-aircok-blue rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
    <span className="text-heading-light text-xs font-bold">✓</span>
  </span>
  <span className="text-body-dark text-[17px] leading-[1.65] [word-break:keep-all]">항목 텍스트</span>
</li>
```

### Emphasis Quote (강조 인용)

다크 배경 위에서 핵심 메시지를 크게 강조하는 인용문 블록. `WhyChooseUsSection` 등 다크 섹션에서 사용.

- 배경: `bg-surface-dark` (다크 섹션 내부 사용)
- **폰트**: Section Heading 수준(40px), weight 600, `text-heading-light`
- **line-height**: 1.10, **letter-spacing**: -0.3px (Section Heading 규칙 준수)
- 정렬: 중앙(`text-center`)
- `word-break: keep-all`
- 선택적으로 상하 `border-y border-border-dark` 또는 따옴표 장식

```tsx
// Emphasis Quote 예시
<blockquote className="text-center [word-break:keep-all]">
  <p className="text-[40px] font-semibold text-heading-light leading-[1.10] tracking-[-0.3px]">
    "핵심 메시지를 여기에 배치합니다"
  </p>
</blockquote>
```

### Page Sub-Hero (페이지 서브 히어로)

About·Services 등 서브 페이지 상단의 텍스트 전용 히어로.

- 배경: `bg-surface-dark`
- 레이아웃: `min-h-[480px] flex items-center` (full-width)
- 내부 콘텐츠: left-align (메인 히어로와 달리 center 아님)
- **소형 레이블**: 12px, weight 600, `text-aircok-blue-light`, `uppercase tracking-widest`
- **H1**: Section Heading (40px, weight 600), `text-heading-light`, `leading-[1.10]`, `tracking-[-0.3px]`, `[word-break:keep-all]`. 모바일 28px.
- **본문 p**: Body (17px, weight 400), `text-body-light`, `leading-[1.65]`, `[word-break:keep-all]`
- 콘텐츠 스택: `flex flex-col gap-4 py-20`

```tsx
// Page Sub-Hero 예시
<section className="bg-surface-dark">
  <div className="max-w-[1200px] mx-auto px-5 min-h-[480px] flex items-center">
    <div className="flex flex-col gap-4 py-20">
      <span className="text-aircok-blue-light text-xs font-semibold uppercase tracking-widest">레이블</span>
      <h1 className="text-[28px] sm:text-[40px] font-semibold text-heading-light leading-[1.10] tracking-[-0.3px] [word-break:keep-all] max-w-[720px]">헤딩</h1>
      <p className="text-[17px] text-body-light leading-[1.65] [word-break:keep-all] max-w-[640px]">본문</p>
    </div>
  </div>
</section>
```

### History Timeline (연혁 타임라인)

연도별 이벤트를 나열하는 2컬럼 타임라인 레이아웃.

- 배경: `bg-surface-white`
- 연도 블록 구분: `border-t border-border-light`
- 레이아웃: `grid grid-cols-[120px_1fr] gap-8 md:grid-cols-[160px_1fr]`
- **연도 숫자**: 40px, weight 700, `text-aircok-blue`, `leading-none`
- **월 레이블**: 14px, weight 500, `text-secondary-dark`, `shrink-0 w-10`
- **이벤트 텍스트**: Body (17px, weight 400), `text-body-dark`, `leading-[1.65]`, `[word-break:keep-all]`

```tsx
// History Timeline 예시
<div className="flex flex-col gap-0">
  {yearGroups.map((block) => (
    <div key={block.year} className="border-t border-border-light py-8 grid grid-cols-[120px_1fr] gap-8 md:grid-cols-[160px_1fr]">
      <div className="text-[40px] font-bold text-aircok-blue leading-none pt-1">{block.year}</div>
      <ul className="flex flex-col gap-4">
        {block.events.map((event) => (
          <li key={event.month + event.text} className="flex gap-3">
            <span className="text-secondary-dark text-sm font-medium shrink-0 w-10">{event.month}</span>
            <span className="text-[17px] text-body-dark leading-[1.65] [word-break:keep-all]">{event.text}</span>
          </li>
        ))}
      </ul>
    </div>
  ))}
</div>
```

---

## 5. Layout Principles

### Spacing System

Base unit: 8px

| Token | Value | 사용처 |
|-------|-------|--------|
| space-1 | 4px | 인라인 요소 간격 |
| space-2 | 8px | 소형 컴포넌트 패딩 |
| space-3 | 12px | 카드 내부 간격 |
| space-4 | 16px | 컴포넌트 패딩 |
| space-5 | 24px | 카드 패딩 |
| space-6 | 32px | 섹션 내 콘텐츠 간격 |
| space-7 | 48px | 중형 섹션 패딩 |
| space-8 | 64px | 대형 섹션 패딩 |
| space-9 | 80px | Hero 섹션 상하 패딩 |
| space-10 | 120px | 최대 섹션 여백 |

### Grid & Container

- Max content width: **1200px** (Apple 980px보다 넓게 — 한국 B2B 사이트 트렌드 반영)
- Hero: full-viewport-width, 콘텐츠 중앙 정렬
- Product grid: 3열 (데스크탑) → 2열 (태블릿) → 1열 (모바일)
- Feature strip: 4열 → 2열 → 1열

**콘텐츠 컨테이너 (`content-container`)**

섹션 내부에서 콘텐츠를 1200px 내에 중앙 정렬할 때 반드시 `content-container` 유틸리티를 사용한다. `max-w-[1200px] mx-auto px-5`를 직접 인라인 작성하는 것은 금지다.

```tsx
// ❌ 금지
<div className="max-w-[1200px] mx-auto px-5">

// ✅ 필수
<div className="content-container">
```

FAQ 등 페이지 전용 너비(1000px 등)는 예외로 허용하되 주석을 명시한다.

### Border Radius Scale

| Name | Value | 사용처 |
|------|-------|--------|
| sm | 6px | 태그, 뱃지 |
| md | 8px | 버튼, 인풋 |
| lg | 12px | 카드, 이미지 컨테이너 |
| xl | 16px | 대형 카드, 모달 |
| pill | 980px | "자세히 보기" 링크 CTA |
| circle | 50% | 아이콘 버튼, 아바타 |

---

## 6. Depth & Elevation

| Level | Treatment | 사용처 |
|-------|-----------|--------|
| Flat (0) | 그림자 없음, 솔리드 배경 | 일반 콘텐츠 섹션 |
| Nav Glass | `backdrop-filter: saturate(180%) blur(20px)` on `rgba(255,255,255,0.80)` | 스티키 네비게이션 |
| Subtle (1) | `rgba(0,0,0,0.12) 0px 4px 24px 0px` | 제품 카드, 팝업 |
| Product Image | `rgba(0,0,0,0.22) 3px 5px 30px 0px` | 제품 렌더 이미지 전용 |
| Focus | `2px solid #0057ff` outline | 키보드 포커스 |

**Shadow 철학**: 그림자는 극도로 아껴 씁니다. 대부분의 depth는 배경색 변화(라이트/다크 섹션 교차)로 표현합니다. 카드에 그림자를 쓸 때는 넓고 부드러운 단일 그림자만 허용합니다.

---

## 7. Do's and Don'ts

### Do
- Aircok Blue (`#0057ff`)는 인터랙티브 요소에만 사용 — 장식 금지
- 섹션 배경 교차: `#f5f5f7` ↔ `#0a0a0a`로 시네마틱 리듬
- 한글 body `line-height: 1.65`, `word-break: keep-all` 적용
- 헤드라인 line-height 1.07–1.14 유지 — 타이트한 압박감이 핵심
- 네비게이션은 반드시 glass blur 효과 (backdrop-filter)
- 제품 이미지는 솔리드 배경 위에 — 그라디언트·텍스처 배경 금지
- max-width 1200px 내 콘텐츠 중앙 정렬
- `space-9`(80px) 이상의 섹션 상하 패딩으로 여유 있는 레이아웃

### Don't
- 두 번째 액센트 컬러 도입 금지 — 브랜드 컬러 예산은 Aircok Blue 하나
- 카드·컨테이너에 테두리 사용 금지 (버튼 특정 케이스 제외)
- 다중 그림자 레이어 금지
- 배경에 그라디언트·패턴·텍스처 금지
- 한글에 letter-spacing -0.1px 이하 적용 금지
- weight 800 이상 사용 금지 (최대 700)
- body 텍스트 중앙 정렬 금지 — 헤드라인만 센터
- 직각(0px) 또는 과도한 radius(20px+, pill 제외) 카드 금지

---

## 8. FAQ 컴포넌트

FAQ 페이지(`/faq`)에서 사용하는 전용 컴포넌트 패턴. 전체 섹션 배경은 `bg-surface-white`(라이트)를 기본으로 한다.

### FAQ Section Layout (데스크탑 2컬럼 사이드바 레이아웃)

데스크탑에서는 좌측 sticky 사이드바 + 우측 아코디언의 2컬럼 구조를 사용한다. 모바일에서는 사이드바를 숨기고 상단 탭으로 폴백한다.

- 섹션 배경: `bg-surface-white`
- 섹션 패딩: `py-20 md:py-28`
- 전체 컨테이너 최대 너비: `max-w-[1000px] mx-auto px-5` {/* token 없음: FAQ 전용 중간 너비, 1200px 보다 좁고 768px 보다 넓은 2컬럼용 */}
- 검색 입력창과 2컬럼 그리드 사이 간격: `mt-8`
- 2컬럼 그리드: `grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-10` {/* token 없음: 사이드바 고정 너비 200px */}
- 사이드바 영역: `hidden sm:block` (모바일 숨김)
- 사이드바 sticky: `sticky top-20`
- 모바일 탭 영역: `sm:hidden` (데스크탑 숨김)
- 전체 구조:

```tsx
// FAQ Section Layout 예시 (데스크탑 2컬럼)
<section className="bg-surface-white py-20 md:py-28">
  <div className="max-w-[1000px] mx-auto px-5"> {/* token 없음: FAQ 2컬럼 전용 너비 */}
    <SectionHeader label="자주 묻는 질문" title="FAQ" theme="light" titleAs="h2" />
    {/* 검색 input */}
    <div className="mt-8">
      <FaqSearchInput ... />
    </div>
    {/* 2컬럼 그리드 */}
    <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-10 mt-8"> {/* token 없음: 사이드바 고정 너비 */}
      {/* 사이드바 (데스크탑만) */}
      <FaqSidebar ... />
      {/* 우측 콘텐츠 */}
      <div>
        {/* 모바일 탭 (모바일만) */}
        <div className="sm:hidden mb-6">
          <CategoryTabList ... />
        </div>
        {/* 아코디언 */}
        <FaqAccordion ... />
      </div>
    </div>
  </div>
</section>
```

### FAQ Search Input (검색 입력창)

섹션 상단에 배치되는 키워드 필터링 입력창. 입력 즉시 아코디언 목록을 필터링한다.

- 컨테이너: `relative`
- input: `w-full bg-surface-light rounded-lg px-4 py-3 pl-10 text-[15px] text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-aircok-blue border-none`
- 검색 아이콘: `absolute left-3 top-1/2 -translate-y-1/2 text-secondary-dark w-5 h-5`
- 아이콘: SVG 돋보기, `pointer-events-none aria-hidden="true"`

```tsx
// FAQ Search Input 예시
<div className="relative">
  <svg
    className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-dark w-5 h-5 pointer-events-none"
    aria-hidden="true"
    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"/>
  </svg>
  <input
    type="search"
    placeholder="질문을 검색하세요"
    className="w-full bg-surface-light rounded-lg px-4 py-3 pl-10 text-[15px] text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-aircok-blue border-none"
  />
</div>
```

### FAQ Sidebar (사이드바 카테고리 네비게이션)

데스크탑(sm 이상)에서 좌측에 배치되는 sticky 카테고리 리스트. 모바일에서는 숨긴다.

- 외부 래퍼: `hidden sm:block`
- 내부 sticky 컨테이너: `sticky top-20`
- 카테고리 섹션 레이블 (선택적): `text-[12px] font-semibold text-secondary-dark uppercase tracking-wider mb-2`
- 항목 버튼 목록: `flex flex-col gap-1`

**사이드바 항목 버튼 — 활성 상태:**
- `w-full flex items-center justify-between text-[15px] font-semibold text-aircok-blue bg-surface-light rounded-md px-3 py-2`

**사이드바 항목 버튼 — 비활성 상태:**
- `w-full flex items-center justify-between text-[15px] font-medium text-body-dark rounded-md px-3 py-2 hover:bg-surface-light hover:text-heading-dark transition-colors`

**카운트 배지 (항목 수 표시):**
- `text-[12px] text-secondary-dark bg-surface-light rounded-pill px-2 py-0.5 ml-auto tabular-nums`
- 활성 상태일 때는 배경 없이: `text-[12px] text-aircok-blue ml-auto tabular-nums`

```tsx
// FAQ Sidebar 예시
<div className="hidden sm:block">
  <div className="sticky top-20">
    <p className="text-[12px] font-semibold text-secondary-dark uppercase tracking-wider mb-2">카테고리</p>
    <div className="flex flex-col gap-1">
      {/* 활성 항목 */}
      <button className="w-full flex items-center justify-between text-[15px] font-semibold text-aircok-blue bg-surface-light rounded-md px-3 py-2">
        <span>전체</span>
        <span className="text-[12px] text-aircok-blue ml-auto tabular-nums">23</span>
      </button>
      {/* 비활성 항목 */}
      <button className="w-full flex items-center justify-between text-[15px] font-medium text-body-dark rounded-md px-3 py-2 hover:bg-surface-light hover:text-heading-dark transition-colors">
        <span>제품 관련</span>
        <span className="text-[12px] text-secondary-dark bg-surface-light rounded-pill px-2 py-0.5 ml-auto tabular-nums">10</span>
      </button>
    </div>
  </div>
</div>
```

### Q Number Label (질문 번호 인라인 레이블)

각 아코디언 질문 앞에 카테고리별 순번을 표시하는 인라인 텍스트 레이블. 이전의 원형 배지(`w-8 h-8 rounded-full`)는 여백이 과도하여 subtle한 인라인 레이블로 대체한다.

- 배지 컨테이너 없음 — `<span>` 인라인 텍스트만 사용
- 레이블 스타일: `shrink-0 text-[13px] font-bold text-aircok-blue leading-none tabular-nums`
- 아코디언 질문 버튼 내 배치 순서: 번호 레이블 → 질문 텍스트 → 토글 아이콘
- **형식 규칙**:
  - 카테고리 '제품 관련': `P${String(index+1).padStart(2,'0')}` (예: P01, P02)
  - 카테고리 '실내공기질': `A${String(index+1).padStart(2,'0')}` (예: A01, A02)
  - '전체' 보기: 각 카테고리 내 원래 순번 유지
  - 검색 결과: 카테고리 내 원래 순번 유지 (필터된 인덱스 기준이 아닌, 카테고리 내 순번 기준)

```tsx
// Q Number Label이 포함된 아코디언 질문 버튼 예시
<button
  className="flex items-center justify-between w-full gap-4 py-5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:rounded-sm"
  aria-expanded={isOpen}
>
  {/* 번호 레이블 + 질문 텍스트 묶음 */}
  <span className="flex items-center gap-3 min-w-0">
    <span className="shrink-0 text-[13px] font-bold text-aircok-blue leading-none tabular-nums" aria-hidden="true">
      P01
    </span>
    <span className="text-[17px] font-semibold text-heading-dark leading-[1.47] [word-break:keep-all] text-left">
      Q. 질문 텍스트
    </span>
  </span>
  {/* 토글 아이콘 */}
  <span className="shrink-0 w-6 h-6 flex items-center justify-center text-secondary-dark transition-colors" aria-hidden="true">
    {/* plus / minus SVG */}
  </span>
</button>
```

### 검색 결과 없음 상태

검색어 입력 후 일치하는 항목이 없을 때 표시하는 빈 상태 메시지.

- 컨테이너: `py-12 text-center`
- 메시지 텍스트: `text-[17px] text-secondary-dark [word-break:keep-all]`
- 부연 설명(선택): `text-[15px] text-secondary-dark mt-2`

```tsx
// 검색 결과 없음 상태 예시
<div className="py-12 text-center">
  <p className="text-[17px] text-secondary-dark [word-break:keep-all]">검색 결과가 없습니다.</p>
  <p className="text-[15px] text-secondary-dark mt-2">다른 키워드로 검색해 보세요.</p>
</div>
```

### Category Tab (카테고리 필터 탭)

### Category Tab (카테고리 필터 탭)

수평 스크롤 가능한 탭 리스트. 모바일에서 가로 스크롤로 overflow 처리한다.

**탭 리스트 컨테이너:**
- `flex flex-row gap-2 overflow-x-auto pb-1 scrollbar-none`
- 스크롤바 숨김: `[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`

**탭 버튼 — 활성 상태:**
- 배경: `bg-aircok-blue`
- 텍스트: `text-heading-light`
- Radius: `rounded-pill`
- 패딩: `px-5 py-2`
- 폰트: `text-[15px] font-medium`
- 최소 높이: `min-h-[44px]` (터치 타깃)
- `shrink-0` 필수 (flex 축소 방지)

**탭 버튼 — 비활성 상태:**
- 배경: `bg-transparent`
- 텍스트: `text-body-dark`
- Radius: `rounded-pill`
- 패딩: `px-5 py-2`
- 폰트: `text-[15px] font-medium`
- hover: `hover:bg-surface-light`
- 트랜지션: `transition-colors`
- 최소 높이: `min-h-[44px]` (터치 타깃)
- `shrink-0` 필수

```tsx
// Category Tab 예시
<div className="flex flex-row gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
  {/* 활성 탭 */}
  <button
    className="shrink-0 rounded-pill px-5 py-2 min-h-[44px] text-[15px] font-medium bg-aircok-blue text-heading-light transition-colors"
  >
    전체
  </button>
  {/* 비활성 탭 */}
  <button
    className="shrink-0 rounded-pill px-5 py-2 min-h-[44px] text-[15px] font-medium bg-transparent text-body-dark hover:bg-surface-light transition-colors"
  >
    제품 관련
  </button>
</div>
```

### Accordion Item (FAQ 아코디언 항목)

질문(Q) 헤더 클릭 시 답변(A) 영역을 토글하는 아코디언. 항목 간 구분은 `border-b border-border-light`로 처리한다.

**아코디언 래퍼 (`<div>`):**
- 닫힌 상태: `border-b border-border-light`
- 열린 상태: `border-b border-border-light bg-surface-light rounded-lg px-4` — 열린 항목에 `bg-surface-light` 배경과 `rounded-lg` 적용으로 시각적 계층감 부여. 나머지 닫힌 항목들과 구분되어 현재 선택 항목이 명확히 부각됨.

**질문(Q) 헤더 버튼 (`<button>`):**
- 레이아웃: `flex items-center justify-between w-full gap-4`
- 패딩: `py-5`
- 질문 텍스트: `text-[17px] font-semibold text-heading-dark leading-[1.47] [word-break:keep-all] text-left`
- 인터랙션: `cursor-pointer`
- 포커스: `focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:rounded-sm`

**토글 아이콘:**
- 컨테이너: `shrink-0 w-6 h-6 flex items-center justify-center text-secondary-dark`
- 열린 상태: "–" (minus) 또는 위쪽 chevron SVG — 색상 `text-aircok-blue`
- 닫힌 상태: "+" (plus) 또는 아래쪽 chevron SVG — 색상 `text-secondary-dark`
- 트랜지션: `transition-colors`

**답변(A) 영역:**
- 패딩: `pb-5`
- 좌측 액센트 라인: `border-l-2 border-aircok-blue pl-4` — Q와 A의 시각적 구분을 Aircok Blue 세로 선으로 명확히 표현
- 텍스트: `text-[17px] text-body-dark leading-[1.65] [word-break:keep-all]`
- 닫힌 상태: CSS 애니메이션(`grid-rows` 트랜지션)으로 처리

```tsx
// Accordion Item 예시 (열린 상태)
<div className="border-b border-border-light bg-surface-light rounded-lg px-4">
  <button
    className="flex items-center justify-between w-full gap-4 py-5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:rounded-sm"
    aria-expanded={true}
  >
    <span className="flex items-center gap-3 min-w-0">
      <span className="shrink-0 text-[13px] font-bold text-aircok-blue leading-none tabular-nums" aria-hidden="true">
        P01
      </span>
      <span className="text-[17px] font-semibold text-heading-dark leading-[1.47] [word-break:keep-all] text-left">
        Q. 질문 텍스트를 여기에 작성합니다
      </span>
    </span>
    <span className="shrink-0 w-6 h-6 flex items-center justify-center text-aircok-blue transition-colors" aria-hidden="true">
      {/* 열린 상태: minus 아이콘 */}
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </span>
  </button>
  {/* 답변 영역 (열린 상태) — 좌측 액센트 라인으로 Q/A 구분 */}
  <div className="pb-5 border-l-2 border-aircok-blue pl-4 flex flex-col gap-3">
    <p className="text-[17px] text-body-dark leading-[1.65] [word-break:keep-all]">
      A. 답변 텍스트를 여기에 작성합니다.
    </p>
  </div>
</div>

// Accordion Item 예시 (닫힌 상태)
<div className="border-b border-border-light">
  <button
    className="flex items-center justify-between w-full gap-4 py-5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:rounded-sm"
    aria-expanded={false}
  >
    <span className="flex items-center gap-3 min-w-0">
      <span className="shrink-0 text-[13px] font-bold text-aircok-blue leading-none tabular-nums" aria-hidden="true">
        P01
      </span>
      <span className="text-[17px] font-semibold text-heading-dark leading-[1.47] [word-break:keep-all] text-left">
        Q. 질문 텍스트를 여기에 작성합니다
      </span>
    </span>
    <span className="shrink-0 w-6 h-6 flex items-center justify-center text-secondary-dark transition-colors" aria-hidden="true">
      {/* 닫힌 상태: plus 아이콘 */}
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </span>
  </button>
  {/* 답변 영역 숨김 (grid-rows-[0fr] 트랜지션) */}
</div>
```

### 아코디언 애니메이션 (선택 옵션)

CSS `grid-template-rows` 트릭을 사용한 부드러운 열림/닫힘 애니메이션:

```tsx
// 답변 래퍼에 적용 — grid-rows 트랜지션
<div
  className={`grid transition-all duration-300 ease-in-out ${
    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
  }`}
>
  <div className="overflow-hidden">
    <p className="pb-5 text-[17px] text-body-dark leading-[1.65] [word-break:keep-all]">
      답변 텍스트
    </p>
  </div>
</div>
```

- `grid-rows-[1fr]` / `grid-rows-[0fr]` 는 Tailwind v4 arbitrary value이며 토큰 없음 — 애니메이션 전용 레이아웃 수치로 허용.

### 아코디언 목록 래퍼

아코디언 항목 전체를 감싸는 래퍼. 최상단에만 `border-t border-border-light`를 추가해 목록 시작을 표시한다.

```tsx
// 아코디언 목록 래퍼
<div className="border-t border-border-light">
  {faqItems.map((item) => (
    <AccordionItem key={item.id} {...item} />
  ))}
</div>
```

---

## 9. Admin / Console UI 패턴

어드민 콘솔(`/console/*`)은 공개 마케팅 페이지와 분리된 내부 도구 페이지이다. 동일한 디자인 토큰을 사용하되, 콘텐츠 컨테이너(`content-container`)는 사용하지 않으며 독립적인 레이아웃 패턴을 따른다.

### Admin Login Layout (어드민 로그인 전체 레이아웃)

전체 화면 중앙 정렬. 흰 배경 위에 카드를 배치하는 고전적인 로그인 UI.

- 페이지 래퍼: `min-h-screen bg-surface-light flex items-center justify-center px-5 py-12`
- 로그인 카드: `bg-surface-white rounded-xl shadow-card w-full max-w-[400px] px-8 py-10 flex flex-col gap-8`
  - `max-w-[400px]` — 로그인 카드 전용 너비. 콘텐츠 컨테이너(1200px)와 무관하며 폼 입력 UI에 최적화된 1회성 수치.

**카드 내부 구조 (3영역)**

1. 헤더 영역 (`flex flex-col gap-2 items-center text-center`)
   - 사이트명: `text-[21px] font-bold text-heading-dark leading-[1.19]`
   - 폼 제목/설명: `text-[15px] text-secondary-dark leading-[1.43]`

2. 폼 슬롯 — `children` prop 위치. 실제 `<form>` 마크업은 `AdminLoginForm`이 담당.

3. (선택) 하단 안내 텍스트: `text-[13px] text-secondary-dark text-center`

```tsx
// AdminLoginView 예시
<main className="min-h-screen bg-surface-light flex items-center justify-center px-5 py-12">
  <div className="bg-surface-white rounded-xl shadow-card w-full max-w-[400px] px-8 py-10 flex flex-col gap-8"> {/* token 없음: 로그인 카드 전용 너비 400px */}
    {/* 헤더 */}
    <div className="flex flex-col gap-2 items-center text-center">
      <p className="text-[21px] font-bold text-heading-dark leading-[1.19]">{SITE.name}</p>
      <p className="text-[15px] text-secondary-dark leading-[1.43]">관리자 로그인</p>
    </div>
    {/* 폼 슬롯 */}
    {children}
  </div>
</main>
```

### Admin Form Input (어드민 폼 입력 필드)

공개 사이트에는 폼 입력 컴포넌트가 없으므로 어드민 전용으로 정의한다.

**입력 그룹 (`<div>` 컨테이너):**
- `flex flex-col gap-1.5`

**레이블 (`<label>`):**
- `text-[14px] font-medium text-heading-dark`

**인풋 — 기본 상태:**
- `w-full bg-surface-light border border-border-light rounded-md px-4 py-3 text-[15px] text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-aircok-blue focus:border-transparent transition-shadow`
- 최소 높이: `min-h-[44px]` (터치 타깃)

**인풋 — 에러 상태:**
- 기본 상태에서 `border-border-light` → `border-error` 로 교체, `focus:ring-aircok-blue` → `focus:ring-error` 로 교체
- `w-full bg-surface-light border border-error rounded-md px-4 py-3 text-[15px] text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent transition-shadow min-h-[44px]`

**에러 메시지 (`<p>`):**
- `text-[13px] text-error leading-[1.33] mt-1`
- 에러 상태일 때만 조건부 렌더링. `role="alert"` 접근성 속성 필수.

**제출 버튼 — 기본 상태:**
- `w-full bg-aircok-blue text-heading-light text-[17px] font-medium rounded-md py-3 min-h-[44px] hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2`

**제출 버튼 — disabled/로딩 상태:**
- 기본 상태에서 `hover:bg-aircok-blue-dark active:scale-[0.97]` 제거, `opacity-60 cursor-not-allowed` 추가
- `w-full bg-aircok-blue text-heading-light text-[17px] font-medium rounded-md py-3 min-h-[44px] opacity-60 cursor-not-allowed transition-colors focus:outline-none`

**폼 전체 래퍼 (`<form>`):**
- `flex flex-col gap-5` — 입력 그룹과 버튼 사이 `space-5` (24px) 간격

```tsx
// AdminLoginForm 예시
<form className="flex flex-col gap-5">
  {/* 입력 그룹 */}
  <div className="flex flex-col gap-1.5">
    <label htmlFor="username" className="text-[14px] font-medium text-heading-dark">
      아이디
    </label>
    <input
      id="username"
      type="text"
      placeholder="아이디를 입력하세요"
      className="w-full bg-surface-light border border-border-light rounded-md px-4 py-3 text-[15px] text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-aircok-blue focus:border-transparent transition-shadow min-h-[44px]"
    />
  </div>

  <div className="flex flex-col gap-1.5">
    <label htmlFor="password" className="text-[14px] font-medium text-heading-dark">
      비밀번호
    </label>
    <input
      id="password"
      type="password"
      placeholder="비밀번호를 입력하세요"
      className="w-full bg-surface-light border border-border-light rounded-md px-4 py-3 text-[15px] text-heading-dark placeholder:text-secondary-dark focus:outline-none focus:ring-2 focus:ring-aircok-blue focus:border-transparent transition-shadow min-h-[44px]"
    />
    {/* 에러 상태일 때 */}
    <p role="alert" className="text-[13px] text-error leading-[1.33] mt-1">
      에러 메시지
    </p>
  </div>

  {/* 폼 레벨 에러 */}
  <p role="alert" className="text-[13px] text-error leading-[1.33] -mt-1">
    아이디 또는 비밀번호가 올바르지 않습니다.
  </p>

  {/* 제출 버튼 (기본) */}
  <button
    type="submit"
    className="w-full bg-aircok-blue text-heading-light text-[17px] font-medium rounded-md py-3 min-h-[44px] hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2"
  >
    로그인
  </button>

  {/* 제출 버튼 (disabled/로딩) */}
  <button
    type="submit"
    disabled
    className="w-full bg-aircok-blue text-heading-light text-[17px] font-medium rounded-md py-3 min-h-[44px] opacity-60 cursor-not-allowed transition-colors focus:outline-none"
  >
    로그인 중...
  </button>
</form>
```

### Admin Button Hierarchy (어드민 버튼 위계)

콘솔 페이지(목록·폼·상태 분기)에서 버튼 위계를 일관되게 적용하기 위한 단일 기준. 신규 색상 토큰 없이 §4 Buttons + §9·§14 기존 톤을 콘솔 맥락으로 정리한 것이다. 한 화면에 동급 primary 버튼이 여러 개 떠서 위계가 무너지는 것을 방지한다.

**위계 원칙**
- 화면당 시각적 무게가 가장 큰 **primary(파란 채움)** 버튼은 "그 화면의 대표 행동" 1개에 한정한다(목록 페이지의 "새 뉴스 작성", 인증 실패 시 "로그인 페이지로 이동" 등 사용자를 다음 단계로 보내는 진입 행동).
- 같은 블록 안의 **복구/보조 행동**(에러 상태의 "다시 시도" 등 현재 화면에 머무르는 재시도)은 primary가 아니라 **secondary(라이트 채움)**로 낮춰, primary와 시각적으로 구분한다.

**Admin Primary 버튼 (파란 채움)** — §9 제출 버튼·§14 default 확인 버튼과 동일 톤
- `inline-flex items-center justify-center bg-aircok-blue text-heading-light text-sm font-medium rounded-md px-4 py-2 min-h-[44px] hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2`
- disabled/로딩: `hover:bg-aircok-blue-dark active:scale-[0.97]` 제거 후 `opacity-60 cursor-not-allowed` 추가

**Admin Secondary 버튼 (라이트 채움)** — §12 AdminNewsForm 취소·§14 취소 버튼 톤 재활용
- `inline-flex items-center justify-center bg-surface-light text-heading-dark text-sm font-medium rounded-md px-4 py-2 min-h-[44px] hover:bg-border-light active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2`
- disabled/로딩: `hover:bg-border-light active:scale-[0.97]` 제거 후 `opacity-60 cursor-not-allowed` 추가

### Admin List State (어드민 목록 상태 분기 UI)

콘솔 목록 페이지(`/console/news` 등)에서 데이터 로딩·인증 실패·일반 실패·빈 목록을 표시하는 상태 블록. 정상 데이터(테이블)와 달리, 상태 블록은 화면 안에서 한 덩어리로 인지되도록 **중앙 정렬 카드형 블록**으로 통일한다(좌측 정렬 인라인 텍스트로 흩뿌리지 않는다).

**상태 블록 컨테이너 (4종 공통)**
- `flex flex-col items-center justify-center text-center gap-4 rounded-xl border border-border-light bg-surface-white px-6 py-16`
- 안내 문구: `text-body-dark font-body text-[15px] leading-[1.43] [word-break:keep-all]`
- 에러 강조 문구(인증 실패·일반 실패): 위 문구에서 색만 `text-error`로 교체
- 보조 설명(선택, 한 줄 더): `text-secondary-dark font-body text-sm leading-[1.43] [word-break:keep-all]`
- 액션 버튼(있을 때): 위 **Admin Button Hierarchy** 사용 — 진입 행동은 primary, 같은 화면 재시도는 secondary

**상태별 적용**
1. **로딩**: 컨테이너 + 안내 문구만(`불러오는 중...`), 색은 `text-secondary-dark`. 버튼 없음.
2. **인증 실패**: `text-error` 안내 문구(`로그인이 필요합니다.`) + **primary** 진입 버튼(`로그인 페이지로 이동` — 다음 단계로 보내는 진입 행동).
3. **일반 실패**: `text-error` 안내 문구 + **secondary** 복구 버튼(`다시 시도` — 현재 화면에 머무르는 재시도이므로 primary로 띄우지 않는다). 로딩 중 라벨은 `다시 시도 중...` + disabled.
4. **빈 목록**: `text-body-dark` 안내 문구(`등록된 뉴스가 없습니다.`) + (선택) **primary** 진입 버튼으로 작성 유도 가능. 에러가 아니므로 `text-error` 사용 금지.

```tsx
// Admin List State 예시 (일반 실패 — secondary 재시도)
<div className="flex flex-col items-center justify-center text-center gap-4 rounded-xl border border-border-light bg-surface-white px-6 py-16">
  <p className="text-error font-body text-[15px] leading-[1.43] [word-break:keep-all]">
    뉴스 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
  </p>
  <button
    type="button"
    onClick={() => refetch()}
    disabled={isRefetching}
    className="inline-flex items-center justify-center bg-surface-light text-heading-dark text-sm font-medium rounded-md px-4 py-2 min-h-[44px] hover:bg-border-light active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-surface-light disabled:active:scale-100"
  >
    {isRefetching ? '다시 시도 중...' : '다시 시도'}
  </button>
</div>
```

### Admin Console Sidebar Layout (어드민 콘솔 사이드바 레이아웃)

콘솔 전역 셸 레이아웃. 기존 상단 가로 nav 헤더(§ConsoleLayout)를 **좌측 고정 사이드바 + 우측 메인 콘텐츠** 2단 구조로 대체한다. 마케팅 페이지와 달리 `content-container`를 사용하지 않고 풀폭 셸을 쓰며, 사이드바는 데스크탑에서 고정·모바일에서 드로어로 접힌다.

**신규 레이아웃 수치 (토큰 없음 — 콘솔 셸 전용 1회성 수치)**
- 사이드바 폭: `w-60` (240px). Tailwind 기본 스페이싱 스케일(`w-60`)을 사용하므로 임의 하드코딩이 아니며, 콘솔 셸의 단일 출처로 고정한다. 메인 콘텐츠의 좌측 여백(`lg:pl-60`)도 동일 값을 참조한다.
- 데스크탑 분기점: `lg`(1024px). `lg` 이상은 고정 사이드바 + 메인 좌측 패딩, `lg` 미만은 사이드바를 화면 밖으로 숨기고(`-translate-x-full`) 상단 모바일 바 + 드로어로 전환한다. 콘솔은 업무용 화면이라 풀 사이드바 노출 기준을 마케팅(834px)보다 높은 1024px로 둔다.

**활성 메뉴 강조 (신규 색상 토큰 없음)**
- 활성 항목 배경은 Aircok Blue의 저채도 틴트를 Tailwind 불투명도 모디파이어로 표현: `bg-aircok-blue/10` (신규 CSS 변수 없이 기존 `--color-aircok-blue`에서 파생). 텍스트·아이콘은 `text-aircok-blue font-semibold`.
- 비활성 항목: `text-secondary-dark`, hover 시 `hover:bg-surface-light hover:text-heading-dark`.

**전체 구조 (전제 마크업)**

`ConsoleLayout`은 `'use client'` 컴포넌트로, 모바일 드로어 열림 상태(`drawerOpen: boolean`)를 보유한다. 마크업은 (1) 모바일 상단 바, (2) 사이드바(`<aside>`), (3) 모바일 드로어 오버레이, (4) 메인 콘텐츠(`<main>`) 4파트로 구성한다. 사이드바는 데스크탑/모바일 드로어에서 동일한 단일 마크업을 공유하고, 위치 클래스(`lg:translate-x-0` vs `-translate-x-full`)만 상태로 토글한다.

- **셸 래퍼**: `min-h-screen bg-surface-light`
- **사이드바(`<aside>`)**: 
  `fixed inset-y-0 left-0 z-50 w-60 bg-surface-white border-r border-border-light flex flex-col transition-transform duration-200 lg:translate-x-0`
  + 모바일 토글: 닫힘일 때 `-translate-x-full`, 열림일 때 `translate-x-0` (둘 다 `lg:translate-x-0`로 데스크탑에서는 항상 노출). `aria-label="콘솔 메뉴"` 권장.
- **사이드바 타이틀/로고 영역**: `flex items-center h-14 px-5 border-b border-border-light shrink-0` 내부에 `text-heading-dark font-body font-semibold text-sm` 로 "어드민 콘솔".
- **메뉴 목록(`<nav>`)**: `flex flex-col gap-1 p-3 flex-1 overflow-y-auto` (`SITE.admin.nav` 순회). `aria-label="콘솔 내비게이션"`.
- **메뉴 아이템 — 활성**: `flex items-center gap-3 rounded-md px-3 py-2.5 min-h-[44px] text-sm font-body font-semibold bg-aircok-blue/10 text-aircok-blue transition-colors`
- **메뉴 아이템 — 비활성**: `flex items-center gap-3 rounded-md px-3 py-2.5 min-h-[44px] text-sm font-body text-secondary-dark hover:bg-surface-light hover:text-heading-dark transition-colors`
- **사이드바 하단 사용자 영역**: `mt-auto border-t border-border-light p-3 flex flex-col gap-2 shrink-0`
  - username: `text-secondary-dark text-sm px-3 truncate`
  - 로그아웃 버튼: `flex items-center gap-2 rounded-md px-3 py-2.5 min-h-[44px] text-sm font-body text-error hover:bg-surface-light transition-colors text-left`
- **모바일 상단 바(`lg:hidden`)**: `sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-surface-white border-b border-border-light`
  - 햄버거 버튼: `inline-flex items-center justify-center w-11 h-11 -ml-2 rounded-md text-heading-dark hover:bg-surface-light transition-colors` (`aria-label="메뉴 열기"`, `aria-expanded={drawerOpen}`, `aria-controls="console-sidebar"`)
  - 타이틀: `text-heading-dark font-body font-semibold text-sm`
- **모바일 드로어 오버레이**: `fixed inset-0 z-40 bg-overlay-dark-60 lg:hidden` — `drawerOpen`일 때만 렌더, 클릭 시 닫힘. 사이드바 `<aside>`에는 `id="console-sidebar"` 부여.
- **메인 콘텐츠(`<main>`)**: `lg:pl-60` (사이드바 폭만큼 좌측 패딩)만 부여한다. **콘텐츠 내부 패딩은 셸이 갖지 않는다.**

> **⚠️ 콘솔 콘텐츠 패딩 단일 출처 정책 (정책 (b) — 뷰 자체 패딩)**: 셸(`<main>`)은 좌측 사이드바 오프셋(`lg:pl-60`)만 책임지고 콘텐츠 패딩을 갖지 않는다. **각 콘솔 뷰(views/widgets)가 자신의 최상위 래퍼에 `p-6 lg:p-8` 패딩을 직접 갖는다.** 이는 기존 콘솔 뷰들(뉴스 관리·로그인 등)이 이미 자체 패딩을 갖는 현실과 일치시키고, 셸과 뷰가 패딩을 이중으로 거는 충돌을 방지하기 위함이다. 콘솔 뷰 신규 작성 시 최상위 래퍼는 `p-6 lg:p-8`(반응형)을 표준으로 한다(과거 일부 뷰의 고정 `p-8`은 점진적으로 `p-6 lg:p-8`로 수렴).

```tsx
// Admin Console Sidebar Layout 골격 ('use client', 상태/인증 로직은 implementer)
<div className="min-h-screen bg-surface-light">
  {/* 모바일 상단 바 */}
  <div className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-surface-white border-b border-border-light lg:hidden">
    <button
      type="button"
      onClick={() => setDrawerOpen(true)}
      aria-label="메뉴 열기"
      aria-expanded={drawerOpen}
      aria-controls="console-sidebar"
      className="inline-flex items-center justify-center w-11 h-11 -ml-2 rounded-md text-heading-dark hover:bg-surface-light transition-colors"
    >
      <svg className="w-6 h-6" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
      </svg>
    </button>
    <span className="text-heading-dark font-body font-semibold text-sm">어드민 콘솔</span>
    <span className="w-11" aria-hidden="true" /> {/* 좌우 대칭용 스페이서 */}
  </div>

  {/* 드로어 오버레이 (모바일, 열림 시) */}
  {drawerOpen && (
    <div
      className="fixed inset-0 z-40 bg-overlay-dark-60 lg:hidden"
      onClick={() => setDrawerOpen(false)}
      aria-hidden="true"
    />
  )}

  {/* 사이드바 (데스크탑 고정 / 모바일 드로어) */}
  <aside
    id="console-sidebar"
    aria-label="콘솔 메뉴"
    className={`fixed inset-y-0 left-0 z-50 w-60 bg-surface-white border-r border-border-light flex flex-col transition-transform duration-200 lg:translate-x-0 ${
      drawerOpen ? 'translate-x-0' : '-translate-x-full'
    }`}
  >
    <div className="flex items-center h-14 px-5 border-b border-border-light shrink-0">
      <span className="text-heading-dark font-body font-semibold text-sm">어드민 콘솔</span>
    </div>
    <nav aria-label="콘솔 내비게이션" className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
      {SITE.admin.nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isNavActive(item.href) ? 'page' : undefined}
          onClick={() => setDrawerOpen(false)}
          className={
            isNavActive(item.href)
              ? 'flex items-center gap-3 rounded-md px-3 py-2.5 min-h-[44px] text-sm font-body font-semibold bg-aircok-blue/10 text-aircok-blue transition-colors'
              : 'flex items-center gap-3 rounded-md px-3 py-2.5 min-h-[44px] text-sm font-body text-secondary-dark hover:bg-surface-light hover:text-heading-dark transition-colors'
          }
        >
          {item.label}
        </Link>
      ))}
    </nav>
    <div className="mt-auto border-t border-border-light p-3 flex flex-col gap-2 shrink-0">
      {user && <span className="text-secondary-dark text-sm px-3 truncate">{user.username}</span>}
      <button
        type="button"
        onClick={() => setLogoutOpen(true)}
        className="flex items-center gap-2 rounded-md px-3 py-2.5 min-h-[44px] text-sm font-body text-error hover:bg-surface-light transition-colors text-left"
      >
        로그아웃
      </button>
    </div>
  </aside>

  {/* 메인 콘텐츠 — 셸은 사이드바 오프셋만, 콘텐츠 패딩은 각 뷰가 자체 보유 (정책 (b)) */}
  <main className="lg:pl-60">{children}</main>
</div>
```

> **모바일 동작 전제**: `drawerOpen` 상태는 `ConsoleLayout` 내부 `useState`로 관리한다. (1) 햄버거 클릭 → `true`, (2) 오버레이 클릭 / 메뉴 항목 클릭 / 라우트 변경 시 → `false`. `lg` 이상에서는 사이드바가 항상 `lg:translate-x-0`로 노출되므로 `drawerOpen` 값과 무관하게 보인다(오버레이·모바일 상단 바는 `lg:hidden`으로 숨김). 라우트 변경 시 자동 닫힘(`useEffect`로 `pathname` 변화 감지)은 implementer가 붙인다.

### Admin Subtab Navigation (어드민 서브탭 내비게이션)

콘솔 단일 페이지 내부에서 여러 패널을 전환하는 **탭 바**. 문의 관리 페이지의 "문의 내역 / 이메일 설정 / 지도 설정" 전환에 사용한다. 사이드바(전역 메뉴)와 구별되는 **페이지 내 로컬 탭**으로, 활성 탭은 하단 밑줄(언더라인) 강조를 사용해 사이드바의 pill/틴트 강조와 시각적으로 구분한다.

**탭 바 컨테이너 (`role="tablist"`)**
- `flex items-center gap-1 border-b border-border-light overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`
- `role="tablist"`, `aria-label`(예: `"문의 관리 탭"`).

**탭 버튼 — 활성** (`aria-selected={true}`)
- `shrink-0 -mb-px border-b-2 border-aircok-blue px-4 py-3 min-h-[44px] text-sm font-body font-semibold text-aircok-blue transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2 rounded-t-md`
- `-mb-px` 로 컨테이너의 `border-b`와 활성 탭의 `border-b-2`를 겹쳐 밑줄이 구분선 위에 정확히 얹히도록 한다.

**탭 버튼 — 비활성** (`aria-selected={false}`)
- `shrink-0 -mb-px border-b-2 border-transparent px-4 py-3 min-h-[44px] text-sm font-body text-secondary-dark hover:text-heading-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2 rounded-t-md`

**접근성 마크업 규칙**
- 컨테이너: `role="tablist"`, `aria-label`.
- 각 탭 버튼: `role="tab"`, `type="button"`, `aria-selected`(활성 `true`/비활성 `false`), `id="tab-<key>"`, `aria-controls="panel-<key>"`.
- 각 패널: `role="tabpanel"`, `id="panel-<key>"`, `aria-labelledby="tab-<key>"`, 비활성 패널은 `hidden`.
- 키보드: 좌우 화살표로 탭 이동(implementer), 활성 탭만 `tabIndex={0}`·비활성은 `tabIndex={-1}` 권장(roving tabindex). 포커스 링은 `focus-visible:ring-2 focus-visible:ring-aircok-blue`.

**준비 중 placeholder (지도 설정 탭)**
- 아직 구현되지 않은 패널을 톤다운된 안내 블록으로 표시한다. §Admin List State의 카드형 블록과 동일 톤을 재활용하되, 에러가 아니므로 `text-error`를 쓰지 않고 `text-secondary-dark`로 낮춘다.
- 블록 컨테이너: `flex flex-col items-center justify-center text-center gap-3 rounded-xl border border-border-light bg-surface-white px-6 py-16`
- "준비 중" 배지(선택): `inline-flex items-center rounded-pill bg-surface-light px-3 py-1 text-xs font-medium text-secondary-dark`
- 안내 문구: `text-secondary-dark font-body text-[15px] leading-[1.43] [word-break:keep-all]`

```tsx
// Admin Subtab Navigation 골격 ('use client', activeTab 상태는 implementer)
<div>
  {/* 탭 바 */}
  <div role="tablist" aria-label="문의 관리 탭" className="flex items-center gap-1 border-b border-border-light overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
    {tabs.map((tab) => {
      const active = tab.key === activeTab;
      return (
        <button
          key={tab.key}
          type="button"
          role="tab"
          id={`tab-${tab.key}`}
          aria-selected={active}
          aria-controls={`panel-${tab.key}`}
          tabIndex={active ? 0 : -1}
          onClick={() => setActiveTab(tab.key)}
          className={
            active
              ? 'shrink-0 -mb-px border-b-2 border-aircok-blue px-4 py-3 min-h-[44px] text-sm font-body font-semibold text-aircok-blue transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2 rounded-t-md'
              : 'shrink-0 -mb-px border-b-2 border-transparent px-4 py-3 min-h-[44px] text-sm font-body text-secondary-dark hover:text-heading-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2 rounded-t-md'
          }
        >
          {tab.label}
        </button>
      );
    })}
  </div>

  {/* 패널들 (비활성은 hidden) */}
  <div role="tabpanel" id="panel-inquiries" aria-labelledby="tab-inquiries" hidden={activeTab !== 'inquiries'} className="pt-6">
    {/* 문의 내역 */}
  </div>
  <div role="tabpanel" id="panel-mail" aria-labelledby="tab-mail" hidden={activeTab !== 'mail'} className="pt-6">
    {/* 이메일 설정 */}
  </div>
  <div role="tabpanel" id="panel-map" aria-labelledby="tab-map" hidden={activeTab !== 'map'} className="pt-6">
    {/* 지도 설정 — 준비 중 placeholder */}
    <div className="flex flex-col items-center justify-center text-center gap-3 rounded-xl border border-border-light bg-surface-white px-6 py-16">
      <span className="inline-flex items-center rounded-pill bg-surface-light px-3 py-1 text-xs font-medium text-secondary-dark">준비 중</span>
      <p className="text-secondary-dark font-body text-[15px] leading-[1.43] [word-break:keep-all]">
        지도 설정 기능은 준비 중입니다.
      </p>
    </div>
  </div>
</div>
```

> **탭 상태 전제**: `activeTab` 상태는 서브탭 컨테이너 컴포넌트(`'use client'`)의 `useState`로 관리한다. URL 쿼리(`?tab=mail`) 동기화가 필요하면 implementer가 `useSearchParams`로 연결한다(본 가이드는 UI 마크업·상태 클래스만 정의). 사이드바의 `SITE.admin.nav`에 "이메일 설정"이 별도 항목으로 있으나, 문의 관리 페이지 내부 서브탭과는 별개 진입로이며, 서브탭 도입 시 nav 항목 정리는 implementer/leader가 결정한다.

---

## 10. Responsive Behavior (구 §9)

### Breakpoints

| Name | Width | 주요 변화 |
|------|-------|----------|
| Mobile | < 480px | 단일 열, 헤드라인 28px |
| Mobile Large | 480–640px | 넓은 단일 열 |
| Tablet Small | 640–834px | 2열 그리드 시작 |
| Tablet | 834–1024px | 네비게이션 풀 펼침 |
| Desktop | 1024–1200px | 3열 그리드 |
| Large Desktop | > 1200px | 1200px max-width 중앙 |

### Collapsing Strategy

- Hero 헤드라인: 56px → 40px → 28px (모바일)
- Product grid: 3열 → 2열 → 1열
- Feature strip: 4열 → 2열 → 1열
- Navigation: 풀 수평 → 햄버거 (834px 이하)
- 섹션 배경 full-width는 모든 브레이크포인트 유지

### Touch Targets
- CTA 버튼: 최소 44px 높이
- 네비게이션 링크: 52px 높이
- "자세히 보기" pill: 충분한 패딩으로 탭 영역 확보

---

## 11. Agent Prompt Guide (구 §10)

### Quick Color Reference

```
Primary CTA:        #0057ff (Aircok Blue)
Hover CTA:          #0040cc
Link (라이트 BG):   #0057ff
Link (다크 BG):     #3d7fff
Focus ring:         #0057ff

Light section BG:   #f5f5f7
Dark section BG:    #0a0a0a
White:              #ffffff

Heading (라이트):   #1d1d1f
Body (라이트):      rgba(0,0,0,0.80)
Secondary (라이트): rgba(0,0,0,0.48)
Heading (다크):     #ffffff
Body (다크):        rgba(255,255,255,0.86)

Card shadow:        rgba(0,0,0,0.12) 0px 4px 24px 0px
Product shadow:     rgba(0,0,0,0.22) 3px 5px 30px 0px
Nav BG:             rgba(255,255,255,0.80) + backdrop-filter: saturate(180%) blur(20px)
```

### Example Component Prompts

- "다크 배경(#0a0a0a) 히어로 섹션. 헤드라인 56px Pretendard weight 600 line-height 1.07 letter-spacing -0.5px 색상 #ffffff. 서브카피 21px weight 400 line-height 1.19 색상 rgba(255,255,255,0.86). CTA 2개: '도입 문의'(배경 #0057ff, 흰 텍스트, 8px radius, 10px 20px 패딩) + '제품 보기'(투명 배경, 흰 테두리 1px solid, 980px radius, pill 형태)."

- "제품 카드: 배경 #f5f5f7, 12px border-radius, 테두리 없음, 그림자 없음. 상단 60% 제품 이미지(솔리드 배경). 제품명 28px Pretendard weight 500 letter-spacing -0.1px line-height 1.14. 설명 14px weight 400 color rgba(0,0,0,0.80). 하단 '자세히 보기' 링크 color #0057ff 14px."

- "Aircok 네비게이션: 52px 높이, 배경 rgba(255,255,255,0.80) backdrop-filter: saturate(180%) blur(20px). 좌측 Aircok 로고, 중앙 메뉴 링크 15px weight 400 rgba(0,0,0,0.80), 우측 '도입 문의' 버튼 #0057ff 8px radius."

- "Feature strip: 4열 그리드, 각 항목에 라인 아이콘(Aircok Blue #0057ff), 제목 21px weight 600 #1d1d1f, 설명 17px weight 400 rgba(0,0,0,0.80). 배경 #ffffff, 상하 패딩 80px."

- "도입 사례 카드: 상단 시설 이미지 rounded-lg(12px), 하단 텍스트 — 고객사명 14px weight 600 rgba(0,0,0,0.48), 성과 수치 28px weight 600 #0057ff, 설명 17px weight 400 #1d1d1f."

### Iteration Guide

1. 모든 인터랙티브 요소 → Aircok Blue (`#0057ff`) 단일 사용
2. 섹션 배경 교차: `#f5f5f7` (정보성) ↔ `#0a0a0a` (몰입형)
3. 한글 body: `line-height: 1.65`, `word-break: keep-all`
4. 헤드라인: line-height 1.07–1.14, letter-spacing 음수 적용
5. 네비게이션 glass blur — 절대 생략 불가
6. 제품 이미지: 솔리드 배경(그라디언트·텍스처 금지)
7. 그림자: 제품 이미지에만 `rgba(0,0,0,0.22) 3px 5px 30px`, 카드에는 `rgba(0,0,0,0.12) 0px 4px 24px`
8. "자세히 보기" 링크: 980px radius pill 형태 유지

---

## 12. 뉴스 게시판 패턴

> **뉴스 표면 컴포넌트(NewsCard / NewsHorizontalRow / NewsFeaturedHero / NewsDetailHero / NewsContent / Location Pin / Image Placeholder)의 단일 기준은 §4 "Component Stylings"이다.** 아래 §12의 NewsCard·NewsDetail 항목은 §4로 통합되었으므로 §4를 따른다. 본 섹션에는 콘솔 전용(AdminNewsForm·TipTap)만 유지한다.

### NewsCard / NewsDetail / 매거진 패턴 → §4 참조
- **NewsCard (목록 카드)** → §4 "News Card" 기준. (날짜 = `text-aircok-blue` 레이블, 제목 18px `text-[18px]`, hover `-translate-y-1` 등.)
- **News Horizontal Row (가로형 리스트)** → §4 "News Horizontal Row" (라이트/다크 변형).
- **News Featured Hero (매거진 대표 기사)** → §4 "News Featured Hero" (overlay / 텍스트 분리형).
- **News Detail Hero (상세 히어로)** → §4 "News Detail Hero" (라이트 변형 A / overlay 변형 B).
- **News 상세 본문 렌더링** → §4 "News Content".
- **목록 페이지 섹션 리듬** → §4 "News Magazine Layout".
- **연도별 필터 탭** → §4 "News Year Filter Tab" (§8 Category Tab 재활용 + 타임라인 변형, `'use client'`).
- **장소 표기** → §4 "Location Pin Icon" (📍 이모지 금지). **빈 이미지** → §4 "Image Placeholder".

### AdminNewsForm (콘솔 폼)
- 폼 컨테이너: `bg-surface-white rounded-xl p-8 shadow-card`
- 레이블: `text-heading-dark text-sm font-semibold font-body`
- 인풋 기본: `w-full rounded-md border border-border-light px-4 py-2 text-body-dark text-sm focus:outline-none focus:ring-2 focus:ring-aircok-blue`
- 체크박스 레이블: `flex items-center gap-2 text-body-dark text-sm`
- 제출 버튼: `bg-aircok-blue text-heading-light rounded-md px-6 py-2 font-semibold text-sm hover:bg-aircok-blue-dark transition-colors`
- 취소/보조 버튼: `bg-surface-light text-heading-dark rounded-md px-6 py-2 font-semibold text-sm hover:bg-border-light transition-colors`

### TipTap 에디터 툴바
- 툴바 컨테이너: `flex gap-1 flex-wrap border border-border-light rounded-t-md bg-surface-light px-2 py-1`
- 툴바 버튼 기본: `px-2 py-1 rounded text-body-dark text-sm hover:bg-border-light transition-colors`
- 툴바 버튼 활성: `bg-aircok-blue text-heading-light`
- 에디터 본문 영역: `min-h-[300px] border border-t-0 border-border-light rounded-b-md px-4 py-3 focus:outline-none text-body-dark text-sm font-body`

---

## 13. shared/ui 공용 컴포넌트화 후보 (뉴스 매거진)

뉴스 매거진 리뉴얼에서 3곳 이상 반복되는 요소를 `src/shared/ui/`로 추출하기 위한 props/스타일 계약. **실제 `.tsx` 생성·`index.ts` export는 frontend-implementer가 수행**하며, 본 섹션은 구현 가이드이다. 추출 시 §4의 토큰·클래스를 그대로 사용한다.

### 13.1 `<DateLabel>` (날짜 레이블)
NewsCard·NewsHorizontalRow·NewsFeaturedHero·NewsDetailHero 등 4곳+에서 반복되는 Aircok Blue 날짜 레이블.

- props:
  - `date: string` (ISO 문자열) — 컴포넌트 내부에서 `YYYY.MM.DD` 포맷
  - `theme?: 'light' | 'dark'` (기본 `'light'`)
  - `size?: 'xs' | 'sm'` (기본 `'xs'`) — 카드/row는 `xs`, hero는 `xs`+`tracking-widest uppercase`
  - `className?: string`
- 스타일:
  - light: `text-aircok-blue text-xs font-body tracking-wide`
  - dark: `text-aircok-blue-light text-xs font-body tracking-wide`
  - hero 변형(레이블형): `tracking-widest uppercase` 추가 (prop 또는 className으로 조정)
- 렌더: `<time dateTime={date}>{formatted}</time>` — 시맨틱 `<time>` 사용, `dateTime`에 원본 ISO 유지

### 13.2 `<LocationTag>` (장소 + 핀 아이콘)
NewsCard·NewsHorizontalRow·NewsDetailHero(뱃지) 등 3곳+. 📍 이모지를 SVG 핀으로 대체하는 단일 출처.

- props:
  - `location: string`
  - `theme?: 'light' | 'dark'` (기본 `'light'`)
  - `variant?: 'plain' | 'badge'` (기본 `'plain'`) — `plain`은 인라인 텍스트, `badge`는 상세 hero의 pill 뱃지
  - `iconSize?: 'sm' | 'md'` (기본 `'sm'` = `w-3.5 h-3.5`)
  - `className?: string`
- 스타일:
  - 래퍼: `inline-flex items-center gap-1`
  - plain/light: `text-secondary-dark text-xs` · plain/dark: `text-body-light opacity-60 text-xs`
  - badge/light: `bg-surface-white rounded-pill px-3 py-1 text-xs text-secondary-dark border border-border-light`
  - badge/dark(overlay hero): `bg-overlay-white-10 backdrop-blur-sm rounded-pill px-3 py-1 text-xs text-body-light border border-border-dark`
- 내부 SVG: §4 "Location Pin Icon" path 그대로(`currentColor` 상속, `aria-hidden`, `shrink-0`)
- `location`이 falsy면 `null` 반환(렌더 안 함)

### 13.3 `<NewsImage>` (커버 이미지 + 폴백 placeholder)
NewsCard·NewsHorizontalRow·NewsFeaturedHero·NewsDetailHero 등 4곳+에서 반복되는 "이미지 있으면 `<img>`, 없으면 placeholder" 분기 + `API_BASE` URL 정규화 로직.

- props:
  - `src: string | null` (coverImage, nullable)
  - `alt: string`
  - `ratio?: 'video' | 'featured' | 'row-thumb'` (기본 `'video'`) → `aspect-video` / `aspect-featured` / `aspect-row-thumb`
  - `theme?: 'light' | 'dark'` (기본 `'light'`) — placeholder 배경 변형
  - `className?: string` (object-cover/scale 등 추가)
- 이미지 분기:
  - `src` 있음: `<img className="{aspect} w-full object-cover ...">`, URL은 `src.startsWith('http') ? src : ${API_BASE}${src}` (현재 view들과 동일 규칙 — `NewsImage` 내부에서 env(`NEXT_PUBLIC_API_URL`)를 직접 읽어 URL을 정규화한다. FSD eslint-plugin-boundaries의 shared→shared 슬라이스 간 import 금지 규칙 때문에 `API_BASE` 상수를 `shared/config`로 중앙화하지는 않는다)
  - `src` 없음: §4 "Image Placeholder" — light(`bg-surface-light` + `text-secondary-dark`) / dark(`bg-surface-dark-1` + `text-body-light opacity-40`)
- 주의: `next/image` 대신 현재 코드처럼 `<img>` + eslint-disable 유지(외부/동적 호스트). 비즈니스 로직(URL 결합)은 단순 문자열 처리이므로 마크업 컴포넌트 범위로 간주.

> 추출 우선순위: (1) `LocationTag`(이모지 제거가 즉시 필요), (2) `DateLabel`, (3) `NewsImage`. 세 컴포넌트 모두 `entities/news` 데이터(`NewsSummary`/`NewsPost`)에 의존하지 않는 순수 표현 컴포넌트로 설계해 `shared/ui`에 위치 가능하게 한다.

---

## 14. 피드백 / 확인 UI 패턴 (다이얼로그 · 토스트)

사용자 행동에 대한 확인(confirmation)과 결과 피드백(feedback)을 일관된 비주얼 언어로 제공하기 위한 패턴. 브라우저 native `confirm()`/`alert()`은 디자인 토큰을 적용할 수 없으므로 **사용을 지양**하고, 아래 `ConfirmDialog`(확인) + Toaster(결과 알림) 조합으로 대체한다. 신규 색상 토큰은 도입하지 않으며 §2 Feedback 토큰(`success`/`error`)과 기존 surface/overlay/radius/shadow 토큰만 사용한다.

### 14.1 ConfirmDialog (공용 확인 다이얼로그)

`shared/ui`에 신설되는 공용 확인 다이얼로그. 위험·비가역 행동을 실행하기 전에 사용자에게 한 번 더 확인을 받는 모달이다. **마크업·className·variant 스타일만 본 가이드의 범위**이며, 포커스 트랩·`Escape` 닫기·열림 상태(open/onConfirm/onCancel)·body 스크롤 락 등 동작 로직은 frontend-implementer가 담당한다(`'use client'` 컴포넌트).

**용도**
- (a) 로그아웃 확인 — "정말 로그아웃 하시겠습니까?" (기본 variant)
- (b) 뉴스 삭제 확인 — "이 뉴스를 삭제하시겠습니까? 삭제 후 되돌릴 수 없습니다." (위험 variant)
- 그 외 비가역 콘솔 액션 일반에 재사용.

**props 계약 (구현 가이드, 실제 타입은 implementer)**
- `open: boolean` — 열림 여부
- `title: string` — 제목 (예: "로그아웃", "뉴스 삭제")
- `description?: string` — 설명/경고 문구
- `confirmLabel?: string` (기본 `'확인'`) · `cancelLabel?: string` (기본 `'취소'`)
- `variant?: 'default' | 'destructive'` (기본 `'default'`) — 확인 버튼의 색을 결정
- `onConfirm: () => void` · `onCancel: () => void`
- `loading?: boolean` (선택) — 확인 처리 중 버튼 비활성/스피너

**오버레이 (딤드 배경)**
- `fixed inset-0 z-50 bg-overlay-dark flex items-center justify-center px-5` — 기존 "다크 모달 오버레이" 토큰(`bg-overlay-dark` = rgba(0,0,0,0.80)) 재활용. 신규 색상 없음.
- 클릭 시 닫힘(취소)은 implementer 처리. 오버레이는 `aria-hidden` 배경, 실제 포커스는 카드로 이동.

**다이얼로그 카드 (중앙)**
- `bg-surface-white rounded-xl shadow-card w-full max-w-[400px] p-8 flex flex-col gap-5` — 모달이므로 §5 Border Radius Scale의 "xl(16px) = 대형 카드·모달" 적용. `shadow-card`로 elevation. `max-w-[400px]` {/* token 없음: 확인 다이얼로그 카드 전용 너비, Admin Login Card와 동일 1회성 수치 */}
- 접근성: 카드에 `role="dialog"`, `aria-modal="true"`, `aria-labelledby`(제목 id)·`aria-describedby`(설명 id) 부여.

**텍스트 영역**
- 제목 (`<h2 id=...>`): Card Title 수준 — `text-[21px] font-bold text-heading-dark leading-[1.19] [word-break:keep-all]`
- 설명 (`<p id=...>`): `text-[15px] text-secondary-dark leading-[1.43] [word-break:keep-all]`
- 위험(destructive) variant라도 설명 문구는 동일 `text-secondary-dark`를 쓴다. 위험 신호는 "확인 버튼 색"으로만 표현하고, 본문까지 빨갛게 칠하지 않는다(과한 경고색 금지).

**버튼 행 (`<div>`)**
- `flex justify-end gap-3` — 취소(좌) → 확인(우) 순서. 모바일에서 폭이 좁으면 `flex-col-reverse sm:flex-row sm:justify-end`로 확인 버튼을 하단에 두는 것을 허용.

**취소 버튼 (보조)** — §12 AdminNewsForm 취소 버튼 톤 재활용
- `bg-surface-light text-heading-dark rounded-md px-5 py-2.5 min-h-[44px] text-[15px] font-medium hover:bg-border-light active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2`

**확인 버튼 — `default` variant (로그아웃 등 비파괴 액션)**
- `bg-aircok-blue text-heading-light rounded-md px-5 py-2.5 min-h-[44px] text-[15px] font-medium hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2`

**확인 버튼 — `destructive` variant (삭제 등 비가역 액션)**
- 기본 variant에서 색만 교체: `bg-aircok-blue` → `bg-error`(§2 Error 토큰, #ff3b30), `hover:bg-aircok-blue-dark` → `hover:opacity-90`, `focus-visible:ring-aircok-blue` → `focus-visible:ring-error`
- `bg-error text-heading-light rounded-md px-5 py-2.5 min-h-[44px] text-[15px] font-medium hover:opacity-90 active:scale-[0.97] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2`
- > Error 토큰은 신규 토큰이 아니다 — §2 Feedback에 정의되어 있고 이미 Admin Form Input 에러 상태(`border-error`/`focus:ring-error`)와 §13에서 `bg-error`로 사용 중이다. hover에 `aircok-blue-dark` 같은 별도 어두운 error 토큰이 없으므로 `hover:opacity-90`으로 대체한다.

**확인 버튼 — `loading`/disabled 상태**
- 두 variant 공통: hover/active 제거 후 `opacity-60 cursor-not-allowed` 추가(§9 Admin 제출 버튼 disabled 규칙과 동일 톤). 라벨을 "삭제 중...", "로그아웃 중..." 등으로 교체.

```tsx
// ConfirmDialog 예시 ('use client' 컴포넌트 — open일 때만 렌더)
// variant === 'destructive' → 확인 버튼 bg-error, 그 외 bg-aircok-blue
<div className="fixed inset-0 z-50 bg-overlay-dark flex items-center justify-center px-5">
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="confirm-title"
    aria-describedby="confirm-desc"
    className="bg-surface-white rounded-xl shadow-card w-full max-w-[400px] p-8 flex flex-col gap-5"
  > {/* token 없음: 확인 다이얼로그 카드 전용 너비 400px */}
    <div className="flex flex-col gap-2">
      <h2 id="confirm-title" className="text-[21px] font-bold text-heading-dark leading-[1.19] [word-break:keep-all]">
        뉴스 삭제
      </h2>
      <p id="confirm-desc" className="text-[15px] text-secondary-dark leading-[1.43] [word-break:keep-all]">
        이 뉴스를 삭제하시겠습니까? 삭제 후 되돌릴 수 없습니다.
      </p>
    </div>
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onCancel}
        className="bg-surface-light text-heading-dark rounded-md px-5 py-2.5 min-h-[44px] text-[15px] font-medium hover:bg-border-light active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2"
      >
        취소
      </button>
      {/* destructive variant — 삭제 */}
      <button
        type="button"
        onClick={onConfirm}
        className="bg-error text-heading-light rounded-md px-5 py-2.5 min-h-[44px] text-[15px] font-medium hover:opacity-90 active:scale-[0.97] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-error focus-visible:ring-offset-2"
      >
        삭제
      </button>
      {/* default variant — 로그아웃 등 (아래 클래스로 교체)
      <button
        type="button"
        onClick={onConfirm}
        className="bg-aircok-blue text-heading-light rounded-md px-5 py-2.5 min-h-[44px] text-[15px] font-medium hover:bg-aircok-blue-dark active:scale-[0.97] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aircok-blue focus-visible:ring-offset-2"
      >
        로그아웃
      </button>
      */}
    </div>
  </div>
</div>
```

> **공용화 메모**: `ConfirmDialog`는 `shared/ui`에 추가하고 `src/shared/ui/index.ts`에 export한다. 로그아웃·뉴스 삭제 등 2곳 이상에서 즉시 재사용되며 콘솔 비가역 액션 일반의 단일 출처가 된다. `entities`/`features` 데이터에 의존하지 않는 순수 표현 컴포넌트로 설계한다.

### 14.2 Toaster / 토스트 피드백 (sonner)

비동기 액션(로그인, 뉴스 생성/수정/삭제, 로그아웃 등)의 **결과**를 비차단(non-blocking) 토스트로 알린다. `sonner` 라이브러리를 사용하며 이미 `app/(main)/layout.tsx`에 마운트되어 있다. 토스트는 결과 피드백 전용이고, 행동 전 확인은 §14.1 `ConfirmDialog`가 담당한다(역할 분리).

**Toaster 마운트 (레이아웃당 1개)**
- 공개 사이트: `app/(main)/layout.tsx`에 `<Toaster position="top-center" richColors />` (현행 유지)
- 콘솔(어드민): 콘솔 레이아웃(`app/(console)/.../layout.tsx` 등)에도 **동일한 props**로 `<Toaster position="top-center" richColors />`를 둔다. 콘솔 액션(뉴스 CRUD, 로그아웃)의 결과도 동일 위치·동일 스타일로 노출해 사이트 전체 피드백 경험을 통일한다.
- **일관성 규칙(필수)**: 모든 Toaster는 `position="top-center"` + `richColors`로 통일한다. 레이아웃마다 위치/색상 옵션을 다르게 두지 않는다. `richColors`는 sonner가 success/error/warning에 §2 Feedback 팔레트와 동일 계열(green/red/amber)의 색을 자동 적용하므로, 토스트 색을 className으로 따로 하드코딩하지 않는다.

**토스트 종류·사용 규칙 (success / error)**
- `toast.success(message)` — 액션이 **성공적으로 완료**되었을 때.
  - 예: "로그인되었습니다", "뉴스가 등록되었습니다", "뉴스가 수정되었습니다", "뉴스가 삭제되었습니다", "로그아웃되었습니다"
- `toast.error(message)` — 액션이 **실패**했거나 검증/네트워크 오류가 발생했을 때.
  - 예: "아이디 또는 비밀번호가 올바르지 않습니다", "뉴스 등록에 실패했습니다. 다시 시도해 주세요", "삭제 중 오류가 발생했습니다"
- (선택) `toast.warning` — 비차단 주의 환기에 한해 사용하되 남용하지 않는다. 폼 인라인 검증 오류는 토스트가 아니라 §9 Admin Form Input의 인라인 에러 메시지(`text-error`)로 처리하고, 토스트는 제출 후 서버 측 실패 같은 "완료 시점" 피드백에 쓴다.

**작성 컨벤션**
- 메시지는 한국어 완결형 문장, 사용자 관점 결과 중심(기술 용어·HTTP 코드 노출 금지).
- 성공/실패 메시지를 동일 액션에서 쌍으로 정의한다(예: 삭제 성공/삭제 실패).
- 토스트는 호출형 API(`toast.success(...)`)이므로 **호출 시점·메시지 결정은 frontend-implementer**가 담당하며, 본 가이드는 마운트 props 일관성과 success/error 사용 기준만 정의한다(토스트 색상·위치는 토큰/옵션으로 고정, 추가 className 금지).

```tsx
// Toaster 마운트 — 공개 + 콘솔 레이아웃 동일 props
import { Toaster } from 'sonner'

// app/(main)/layout.tsx / 콘솔 layout.tsx 공통
<Toaster position="top-center" richColors />

// 호출 예시 (implementer 범위 — 결과 피드백)
import { toast } from 'sonner'

toast.success('뉴스가 등록되었습니다')
toast.error('뉴스 등록에 실패했습니다. 다시 시도해 주세요')
```

> **역할 분리 요약**: 비가역 행동 직전 확인 → §14.1 `ConfirmDialog`(딤드 모달). 행동 결과 알림 → §14.2 Toaster(`toast.success`/`toast.error`). native `confirm`/`alert`은 두 경우 모두에서 대체한다.
