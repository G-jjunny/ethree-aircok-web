# 디자인 토큰 추출 스펙 — Claude Design 초안 (Landing + About)

> 출처: Claude Design 프로젝트 `15fc4772-51fe-4117-9810-2659d738aa1b`
> 파일: `SmartAircok Landing.dc.html`, `SmartAircok About.dc.html`
> 원본 스냅샷: `docs/design-drafts/SmartAircok-Landing.html`
> 이 문서는 **원본 초안에서 실측한 모든 raw 값**의 인벤토리다. design 에이전트(Bootstrap)가 이 값을 OKLCH로 변환해 `app/globals.css @theme inline` · `docs/design.md` · `.claude/skills/design-system/SKILL.md` 3종을 재작성한다.

## 0. 디자인 방향성 (중요)

기존 토큰 시스템(올리브/크림/오가닉, `--brand-hue: 263` placeholder)은 **이 초안과 전혀 맞지 않는다.** 이 초안은 **블루-테크(blue-tech)** 방향이다:

- 밝은 배경(흰색 / 연회색 `#f5f7fb`) + 다크 네이비 섹션(`#0a1020`~`#070b16`) 교차
- 프라이머리 블루 `#2b6bff`, 포인트 시안 `#12b5cf`
- 디스플레이 폰트 **Sora**(영문/숫자/eyebrow) + 본문 **Pretendard**(한글)
- 플랫(그림자는 블루/블랙 글로우 위주), pill·rounded 카드, 대각선 줄무늬 이미지 플레이스홀더

→ 올리브/크림/tint(연녹)/accent(라임) 계열 토큰은 **폐기**. 아래 값으로 전면 재추출한다.

## 1. 색상 (raw → OKLCH 변환 대상)

### 브랜드 / 포인트
| raw hex | 역할 | 제안 토큰명 |
| --- | --- | --- |
| `#2b6bff` | 프라이머리 블루 (CTA, 링크, 강조 텍스트) | `--color-brand` |
| `#1e4fd6` | 프라이머리 딥 (hover, 그라디언트 끝) | `--color-brand-hover` |
| `#12b5cf` | 시안 포인트 (다크 위 eyebrow·강조, 수치 단위) | `--color-cyan` (accent) |
| `#0c8fa5` | 시안 딥 (variant, About STATS) | `--color-cyan-hover` |
| white | 브랜드 버튼 위 텍스트 | `--color-brand-ink` |

CTA 그라디언트: `linear-gradient(135deg,#2b6bff,#1e4fd6)` / CTA 섹션 배경 `linear-gradient(120deg,#2b6bff,#1e4fd6)`.

### 잉크 / 중립 (라이트 배경)
| raw hex | 역할 | 제안 토큰명 |
| --- | --- | --- |
| `#0d1526` | 기본 헤딩/본문 (ink) | `--color-ink` |
| `#48505f` | 카드 본문 (약간 옅은 ink) | `--color-ink-soft` |
| `#5a6478` | 보조 본문/설명 (muted) | `--color-muted` |
| `#6b7488` | 비활성 탭 라벨 | `--color-muted-2` (또는 muted 재사용) |
| `#9aa6b8` | 메타/출처/플레이스홀더 라벨 | `--color-faint` |
| `#b3bccb` | 로고 플레이스홀더 텍스트 | (faint 재사용 가능) |

### 표면 / 배경
| raw hex | 역할 | 제안 토큰명 |
| --- | --- | --- |
| `#ffffff` | 카드/기본 흰 배경 | `--color-surface-white` |
| `#f5f7fb` | 연회색 섹션 배경 | `--color-surface` (또는 surface-muted) |
| `#f8fafd` | 비활성 탭 배경 | `--color-surface-2` |
| `#eef3ff` / `#eef2f8` / `#f6f8fc` | 아이콘 박스·플레이스홀더 연블루 tint | `--color-tint` |
| `#dce6ff` | 연블루 보더 (아이콘 박스) | `--color-tint-border` |
| `#e6eaf1` | 기본 hairline 보더 | `--color-hairline` |

### 다크 섹션
| raw hex | 역할 | 제안 토큰명 |
| --- | --- | --- |
| `#0a1020` | 네이비 (헤더/트러스트 스트립 기본 다크) | `--color-navy` |
| `#070b16` | 가장 어두운 배경 (footer, hero 끝) | `--color-navy-deep` |
| `#12224d` | 히어로 radial 상단 블루-네이비 | `--color-navy-tint` |
| `#0e1c40` | 카드03 줄무늬 다크 | (navy-tint 계열) |

히어로 배경: `radial-gradient(120% 90% at 78% 0%,#12224d 0%,#0a1020 55%,#070b16 100%)`
플랫폼 배경: `radial-gradient(120% 100% at 20% 0%,#12224d,#0a1020 60%)`

### 상태 (공기질 지수 — AQI 그라디언트 바)
| raw hex | 역할 |
| --- | --- |
| `#34d17f` / `#5fe39a` / `#7ee0a6` | 좋음(green) |
| `#7fb0ff` | 보통(blue) |
| `#f5a524` | 주의(amber) |
| `#ef4444` | 나쁨(red) |

AQI 바: `linear-gradient(90deg,#34d17f,#2b6bff,#f5a524,#ef4444)`
→ 상태색은 `--color-aqi-good/normal/warning/bad` 로 분리 정의 권장(홈페이지 실시간 카드에서 재사용).

### 다크 배경 위 반투명 (하드코딩 아님 — white + opacity)
본문 강/약: `text-white/92 /85 /82 /75 /70 /68 /62 /60 /55 /50` · 저대비 라벨 `/40 /35 /28` · divider `border-white/8 /6 /12 /14` · 아이콘/아웃라인 `/20 /22 /50`
브랜드 글로우: `rgba(43,107,255,.55 / .5 / .4 / .38 / .28 / .18 / .14 / .12)` · 시안 글로우 `rgba(18,181,207,.4 / .18)`

배지(다크 위): 텍스트 `#a8c4ff`, 배경 `rgba(43,107,255,.12)`, 보더 `rgba(43,107,255,.4)`
행동요령 팁: 텍스트 `#bcd2ff`, 배경 `rgba(43,107,255,.14)`, 보더 `rgba(43,107,255,.28)`
Footer 링크: `#8ab0ff`

## 2. 타이포그래피

### 폰트 패밀리
- `--font-display`: `'Sora', sans-serif` — 영문 라벨/숫자/eyebrow/워드마크 (weights 400,500,600,700,800)
- `--font-body`: `'Pretendard', system-ui, sans-serif` — 한글 헤딩 & 본문 (기본 body)

### 사이즈 스케일 (초안 실측 px — 네이밍 토큰으로 재정의)
| px | 쓰임 | 제안 토큰 |
| --- | --- | --- |
| 60 | 히어로 h1, About STATS "1등급" featured | `text-hero` |
| 56 | 실시간 지수 큰 숫자 | `text-display` |
| 52 | About 페이지 히어로 h1 | `text-h1` (또는 hero-sm) |
| 46 | About STATS 숫자 (2018/9종/10년+) | `text-stat` |
| 44 | "Our Value" h2 | `text-h1` |
| 38 | 섹션 h2 (ABOUT/CTA), 지표 숫자 | `text-h2` |
| 36 | Impact h2 | `text-h2` (동일 계열) |
| 34 | About 섹션 h2 (MISSION/TEAM/HISTORY/PARTNERS) | `text-h3` |
| 30 | Clients h2 | `text-h3` |
| 28 | 히어로 통계 숫자 | `text-h4` |
| 26 | 탭 패널 h3 | `text-h4` |
| 24 | 단위 span (종/등급/년+) | `text-2xl`(기본) |
| 22 | 지표 소숫자, 팀 카드 h | `text-xl`(기본 20↔22 조정) |
| 20 | Value 카드 h3, History 연도 | `text-xl` |
| 18 | 카드 타이틀 | `text-lg` |
| 17 | 히어로/step 본문 | `text-lead` |
| 16.5 | 섹션 리드 본문 | `text-lead-sm` |
| 16 | 기본 본문 | `text-base`(기본) |
| 15.5 / 15 | 리스트/본문 소 | `text-body-sm` |
| 14.5 | detail | `text-detail` |
| 14 | 기본 소본문/nav | `text-sm`(기본) |
| 13.5 | step 설명 | `text-meta` |
| 13 | 통계 라벨/footer/eyebrow 대 | `text-meta` |
| 12.5 | eyebrow(대)/배지/팁 | `text-eyebrow` |
| 12 | caption | `text-xs`(기본) |
| 11 | 카드 eyebrow(소)/mini 라벨 | `text-mini` |
| 10.5 / 10 | 탭 en 라벨/이미지 자리 라벨 | `text-nano` |

> 기본 Tailwind 유틸(text-sm=14/base=16/xl=20/2xl=24)과 겹치는 구간은 기본 유틸 재사용, 그 외 비표준(60/56/52/46/44/38/36/34/30/28/26/17/16.5/13.5/12.5/11/10.5)만 네이밍 토큰으로 추가.

### 웨이트
`font-medium(500)` `font-semibold(600)` `font-bold(700)` `font-extrabold(800)` — 800이 헤딩 기본.

### 레터 스페이싱 (tracking)
| em | 쓰임 | 제안 토큰 |
| --- | --- | --- |
| -0.03 | 워드마크 | `tracking-wordmark` |
| -0.02 | 헤드라인 기본 | `tracking-headline` |
| -0.01 | 서브 헤딩 | `tracking-tight` |
| .02 | 배지 | (기본) |
| .05 | 파트너 라벨 | `tracking-label-sm` |
| .08 | 플레이스홀더 라벨 | `tracking-label` |
| .10 | footer 태그라인 | `tracking-label` |
| .12 | 히어로 하단 라벨 | `tracking-caption` |
| .14 | 카드 eyebrow/트러스트 | `tracking-eyebrow` |
| .16 | 탭 en / 소 eyebrow | `tracking-eyebrow` |
| .18 | 섹션 eyebrow | `tracking-eyebrow-lg` |
| .40 | 워드마크 서브 (CLEAN AIR · SMART SPACE) | `tracking-widest` |

### 라인 높이
헤드라인 `1.05~1.32` · 본문 `1.5~1.8` · 숫자 `1` · 워드마크 `.9`

## 3. 스페이싱 / 레이아웃
- 컨테이너: `max-width:1240px; margin:0 auto; padding:0 32px` → **`content-container` 유틸을 1240/32 로 갱신**
- 섹션 수직 패딩: `--sa-pad` = **96px 기본** (Roomy 112 / Compact 68). 특수: 히어로 96/110, About-hero 92/84, STATS 80, 워드마크 56/44, footer 56/40
  → `py-24`(96) 중심, 필요 시 `py-20`(80)/`py-28`(112)
- 그리드 간격: 카드 gap 16, 큰 컬럼 gap 52~56, 통계 gap 34~36
- 4px 그리드 정규화 유지

## 4. 라운드 (border-radius)
| px | 쓰임 | 제안 토큰 |
| --- | --- | --- |
| 999 | pill (버튼/배지) | `rounded-pill` |
| 22 | 히어로 실시간 카드, 팀 이미지 | `rounded-2xl`(기본 16↔ 조정) → `rounded-card-lg` |
| 20 | 다크 통계 카드, 이미지 박스 | `rounded-card` |
| 18 | Value 이미지 카드, 아이콘 박스 | `rounded-image` |
| 16 | 탭 셸/패널, 트러스트 카드, 내부 이미지 | `rounded-lg`(기본) |
| 14 | STATS 내부 미니 이미지 | `rounded-md` |
| 12 | 버튼/소카드/로고칩 | `rounded-btn` |
| 11 | 탭 번호 박스 | (btn 계열) |
| 50% | 원형(도트/아이콘/VIEW MORE) | `rounded-full` |

## 5. 그림자 (블루/블랙 글로우)
| 값 | 쓰임 | 제안 토큰 |
| --- | --- | --- |
| `0 6px 18px rgba(43,107,255,.4)` | 헤더 pill 버튼 | `--shadow-brand-sm` |
| `0 10px 30px rgba(43,107,255,.45)` | 히어로 CTA | `--shadow-brand` |
| `0 10px 26px rgba(43,107,255,.4)` | step04 아이콘 | `--shadow-brand` (근사 통합) |
| `0 12px 30px rgba(43,107,255,.4)` | 플랫폼 CTA | `--shadow-brand` |
| `0 12px 30px rgba(0,0,0,.2)` | CTA 흰 버튼 | `--shadow-soft` |
| `0 30px 70px rgba(0,0,0,.45)` | 히어로 플로팅 카드 | `--shadow-float` |

## 6. 모션
- transition: `.2s` (배경/보더 색). → `--duration-fast` 유틸 유지 (Tailwind v4엔 `--duration-*` 네임스페이스 없음 → `@utility duration-fast`)
- easing: `ease-in-out`(플로팅/드리프트), `ease-out`(기본)
- keyframes(홈페이지 실시간 카드/마퀴에서 사용): `sa-pulse`(도트), `sa-float`(카드), `sa-marquee`/`sa-marq-l`/`sa-marq-r`(로고), `sa-drift`(배경 글로우), `sa-rise`(등장)

## 7. 공용 컴포넌트 후보 (Pre 대상)
- `<Button variant="primary|dark|outline|white" size="sm|md">` — 헤더 pill / 히어로 CTA(rounded 12) / CTA 흰버튼 / 아웃라인
- `<SectionLabel>` (eyebrow) — Sora, tracking .16~.18, 색상 brand|cyan(다크 위)
- (후속) `<StatCard>`, `<PartnerMarquee>`, `<AqiCard>` 등은 홈페이지 구현 시 3곳 이상 반복 판단 후 결정
