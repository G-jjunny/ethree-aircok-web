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
  --color-nav-bg:           rgba(255, 255, 255, 0.80);
  --color-nav-bg-mobile:    rgba(255, 255, 255, 0.95);
  --color-overlay-white-10: rgba(255, 255, 255, 0.10);

  /* ── Border ─────────────────────────────── */
  --color-border-light:  rgba(0, 0, 0, 0.06);
  --color-border-subtle: rgba(0, 0, 0, 0.04);
  --color-border-dark:   rgba(255, 255, 255, 0.08);

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
| **Border (반투명)** | | |
| 라이트 구분선 | `border-border-light` | `--color-border-light` |
| 미세 구분선 | `border-border-subtle` | `--color-border-subtle` |
| 다크 구분선 | `border-border-dark` | `--color-border-dark` |
| **폰트** | | |
| 디스플레이 헤딩 | `font-display` | `--font-display` |
| 본문 | `font-body` | `--font-body` |
| **레이아웃** | | |
| 콘텐츠 컨테이너 | `content-container` | `max-w-[1200px] mx-auto px-5` |

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
| Section Heading | 40px (2.50rem) | 600 | 1.10 | -0.3px | 섹션 타이틀 |
| Tile Heading | 28px (1.75rem) | 500 | 1.14 | -0.1px | 제품 타일 헤드라인 |
| Card Title | 21px (1.31rem) | 700 | 1.19 | 0px | 카드 강조 헤딩 |
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

## 9. Responsive Behavior

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

## 10. Agent Prompt Guide

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
