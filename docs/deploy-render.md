# Render 배포 가이드 (무료 플랜)

> ⚠️ **반드시 먼저 읽어주세요**
> Render 무료 플랜의 세부 수치·정책(월 사용시간 한도, 유휴 스핀다운 시간, 무료 Postgres 보존 기간, 빌드 메모리 한도 등)은 **자주 변경됩니다.**
> 이 문서의 수치는 작성 시점 기준이며, **배포 시점에 [Render 공식 문서](https://render.com/docs)에서 반드시 재확인**하세요.

저장소 루트의 `render.yaml`(Blueprint)로 3개 리소스를 한 번에 생성합니다.

| 리소스          | 종류               | 소스                                     |
| --------------- | ------------------ | ---------------------------------------- |
| `aircok-db`     | PostgreSQL (free)  | —                                        |
| `aircok-server` | Web (Docker, free) | `server/Dockerfile`, context `./server`  |
| `aircok-web`    | Web (Node, free)   | 저장소 루트 (Next.js)                    |

---

## 1. 환경변수 전체 목록

### 1-1. `aircok-server` (백엔드)

| 이름                      | 용도                                        | 획득 방법                                                        | 필수 |
| ------------------------- | ------------------------------------------- | ---------------------------------------------------------------- | ---- |
| `DATABASE_URL`            | Postgres 연결 문자열                        | **자동** — Blueprint 가 `aircok-db` 에서 주입 (`fromDatabase`)   | ✅   |
| `NODE_ENV`                | 실행 모드                                   | **자동** — `production` 고정값                                    | ✅   |
| `PORT`                    | 리슨 포트                                   | **자동** — Render 가 주입. `render.yaml` 에 선언하지 말 것        | ✅   |
| `JWT_SECRET`              | 관리자 로그인 토큰 서명 키                  | 32자 이상 랜덤 문자열 직접 생성 (`openssl rand -base64 48` 등)   | ✅   |
| `ADMIN_SEED_PASSWORD`     | 초기 관리자 계정 비밀번호 (`prisma/seed.ts`) | 직접 지정. 미설정 시 **시드가 예외로 중단되어 배포 실패**        | ✅   |
| `CLOUDFLARE_ACCOUNT_ID`   | R2 엔드포인트 구성                          | Cloudflare 대시보드 > 계정 ID                                     | ✅   |
| `R2_ACCESS_KEY_ID`        | R2 인증                                     | Cloudflare R2 > API 토큰 발급 화면                                | ✅   |
| `R2_SECRET_ACCESS_KEY`    | R2 인증                                     | 위와 동일 (발급 시 1회만 노출)                                    | ✅   |
| `R2_BUCKET_NAME`          | 업로드 대상 버킷                            | R2 버킷 이름                                                      | ✅   |
| `R2_PUBLIC_URL`           | 업로드 파일 공개 URL 베이스                 | R2 버킷 Public URL (아래 🚨 경고 필독), 끝 슬래시 없이            | ✅   |
| `SMTP_HOST`               | 문의 알림 메일 서버                         | 메일 제공자 (예: `smtp.gmail.com`)                                | ⬜   |
| `SMTP_PORT`               | SMTP 포트                                   | `465`(SSL) 또는 `587`(TLS). 미설정 시 587                         | ⬜   |
| `SMTP_USER`               | SMTP 인증 계정                              | 메일 제공자                                                       | ⬜   |
| `SMTP_PASS`               | SMTP 인증 비밀번호                          | Gmail 은 **앱 비밀번호**                                          | ⬜   |
| `MAIL_FROM`               | 발신자 주소                                 | 직접 지정                                                         | ⬜   |
| `INQUIRY_RECIPIENT_EMAIL` | 문의 알림 수신자                            | 직접 지정                                                         | ⬜   |
| `CORS_ORIGIN`             | 허용 출처 (콤마 구분)                       | 보통 불필요(아래 설명). 필요 시 프론트 도메인                     | ⬜   |

> 🚨 **`R2_PUBLIC_URL` 은 프론트의 R2 호스트 상수와 반드시 일치해야 합니다.**
> 프론트는 `src/shared/lib/url/resolveSameOriginUrl.ts` 의 `R2_PUBLIC_HOST` 를 **단일 소스**로 삼아
> ① `next.config.ts` 의 `images.remotePatterns` 호스트, ② `/r2/:path*` rewrite destination,
> ③ 절대 URL → 동일출처 경로 환원 로직(`resolveSameOriginUrl`) 세 곳에서 함께 사용합니다.
> 현재 값은 **`pub-046c2c24be4d444aaa70d8be1a5cd092.r2.dev`** 이므로
> 백엔드 `R2_PUBLIC_URL` 은 `https://pub-046c2c24be4d444aaa70d8be1a5cd092.r2.dev` 이어야 합니다.
> 다른 버킷이나 커스텀 도메인으로 바꾸려면 **`R2_PUBLIC_HOST` 상수를 수정하고 프론트를 재빌드·재배포**해야 합니다.
> (이 값은 빌드 시점에 rewrite/번들로 굳어지므로 환경변수만 바꾸는 것으로는 반영되지 않습니다.)
> 호스트가 어긋나면 `next/image` 최적화가 거부되어 이미지가 **500** 으로 깨지고,
> `/r2` 프록시도 잘못된 버킷을 가리켜 PDF 뷰어·다운로드가 **404** 로 깨집니다.

- ⬜ 항목(SMTP 6종)은 비워두면 **메일 발송만 건너뛰고** 문의 접수 자체는 정상 동작합니다.
- `CORS_ORIGIN`: 프론트엔드는 `next.config.ts` 의 rewrite 프록시로 **동일 출처** 요청을 보내므로 CORS 가 발생하지 않습니다. 외부 도구/도메인에서 API 를 직접 호출해야 할 때만 설정하세요. 미설정 시 서버는 기본값 `http://localhost:3000` 만 허용합니다.

### 1-2. `aircok-web` (프론트엔드)

| 이름                  | 용도                            | 획득 방법                                                     | 필수 |
| --------------------- | ------------------------------- | ------------------------------------------------------------- | ---- |
| `NEXT_PUBLIC_API_URL` | `/api/*`, 레거시 `/uploads/*` 프록시 대상 (R2 `/r2/*` 는 무관) | **스킴 포함 전체 URL** 직접 입력 (예: `https://aircok-server.onrender.com`) | ✅   |
| `NODE_OPTIONS`        | 빌드 메모리 조정                | 빌드 OOM 발생 시에만 `--max-old-space-size=2048` 등            | ⬜   |

> **왜 `fromService: { property: host }` 로 자동 연결하지 않나?**
> Render 의 `host` property 는 **스킴이 빠진 호스트명**(`aircok-server.onrender.com`)만 반환합니다.
> `next.config.ts` 는 이 값을 `${API_ORIGIN}/api/:path*` 형태의 rewrite destination 으로 사용하는데, 스킴이 없으면 유효한 절대 URL 이 아니어서 rewrite 가 깨집니다.
> 그래서 `sync: false` 로 두고 대시보드에서 `https://` 를 포함한 전체 URL 을 직접 입력합니다.

---

## 2. Render 대시보드 설정 순서

1. **Blueprint 연결**
   Render 대시보드 > **New > Blueprint** > 이 저장소 선택 > 브랜치 지정 > `render.yaml` 자동 인식 확인 > Apply.
2. **DB 생성 확인**
   `aircok-db` 가 먼저 생성되고, `aircok-server` 의 `DATABASE_URL` 이 자동으로 연결되었는지 Environment 탭에서 확인합니다.
3. **시크릿 입력 (`aircok-server`)**
   `sync: false` 로 표시된 항목(위 표의 ✅ 중 자동이 아닌 것 + 필요한 ⬜)을 Environment 탭에서 입력합니다.
   - 최소한 `JWT_SECRET`, `ADMIN_SEED_PASSWORD`, R2 5종은 **반드시** 입력해야 기동에 성공합니다.
4. **백엔드 배포**
   Manual Deploy 또는 자동 배포로 `aircok-server` 를 배포하고, 로그에서 `migrate deploy` → seed → `Server running on ...` 순서를 확인합니다.
5. **프론트 `NEXT_PUBLIC_API_URL` 입력**
   `aircok-server` 의 실제 URL(`https://<서비스명>.onrender.com`)을 복사해 `aircok-web` Environment 에 입력합니다.
6. **프론트 재배포**
   `NEXT_PUBLIC_API_URL` 은 빌드 시점에 `next.config.ts` rewrite 로 굳어지므로, 값 입력 후 **반드시 재배포**해야 반영됩니다.

---

## 3. 마이그레이션 · 시드 자동 실행

`server/docker-entrypoint.sh` 가 컨테이너 시작 시 아래를 순서대로 실행합니다.

```sh
npx prisma migrate deploy
npm run prisma:seed
npm run prisma:seed:news
npm run prisma:seed:core-values
npm run prisma:seed:timeline
npm run prisma:seed:media
npm run prisma:seed:air-devices
exec node dist/src/main
```

- **`migrate deploy` 만 사용하는 이유**
  `migrate deploy` 는 저장소에 커밋된 마이그레이션 파일만 순서대로 적용하며, 스키마 드리프트를 감지해도 DB 를 리셋하지 않습니다.
  반면 `migrate dev` 는 새 마이그레이션을 생성하거나 드리프트 감지 시 **DB 를 리셋(데이터 전량 삭제)** 할 수 있고, `migrate reset` 은 무조건 삭제합니다. 프로덕션에서는 두 명령을 절대 사용하지 않습니다.
- **시드 재실행 안전성**
  각 seed 스크립트는 count/sentinel 멱등 가드를 갖고 있어 재기동 때 중복 삽입되지 않습니다. 무료 플랜의 잦은 스핀다운/재시작에도 안전합니다.
- **로컬 docker-compose 는 영향 없음**
  `docker-compose.yml` 의 `migrate` 서비스가 이미 동일 작업을 수행하므로, `server` 서비스는 `command: node dist/src/main` 으로 entrypoint 를 오버라이드해 중복 실행을 피합니다.
- **런타임 이미지에 devDependencies 포함**
  `prisma` CLI 와 `ts-node` 기반 seed 실행이 필요해 `server/Dockerfile` runtime 스테이지에서 `npm prune --omit=dev` 를 제거했습니다. 이미지 크기는 커지지만 기동 실패 리스크가 사라집니다.

---

## 4. 레거시 `/uploads` 데이터 R2 이관 (배포 전 필수 1회)

카탈로그·팀 이미지 업로드는 이제 **Cloudflare R2 로 일원화**되었습니다(신규 업로드는 절대 URL 반환).
다만 기존 DB 에는 `/uploads/xxx` 형태의 로컬 경로 레코드가 남아 있을 수 있습니다.

> 🚨 **경고 — 반드시 배포 전에 로컬에서 실행하세요.**
> Render 무료 티어의 디스크는 **휘발성**이라 배포 후에는 `server/public/uploads` 의 원본 파일이 존재하지 않습니다.
> 파일이 사라진 뒤에는 이관이 불가능하며, 해당 이미지는 영구히 깨집니다.

### 절차

1. 원본 파일이 있는 **로컬 작업 트리**에서 `server/public/uploads` 존재를 확인합니다.
2. 프로덕션 `DATABASE_URL`(Render DB 의 External Connection String)과 R2 5종 env 를 환경에 지정합니다. 값은 셸 환경변수로만 주입하고 **파일에 커밋하지 마세요.**
3. 실행:
   ```bash
   cd server
   npm run migrate:catalog-team-to-r2
   ```
4. 로그에서 `[OK] ... -> https://.../catalog/...` 를 확인합니다. `[SKIP] 파일 없음` 이 나오면 해당 레코드는 원본이 이미 유실된 것이며, 관리자 콘솔에서 재업로드해야 합니다.

- 이 스크립트는 **수동 1회 실행 전용**이며, `docker-entrypoint.sh` 에 포함되어 있지 않습니다(포함하지 마세요).
- `main.ts` 의 `useStaticAssets('/uploads')` 는 **하위호환을 위해 유지**합니다. 이관 전이거나 이관이 실패해도 원본 파일이 있는 환경에서는 기존 레코드가 계속 동작합니다.

---

## 5. 카탈로그 R2 URL 대응 (해결 완료 — `/r2` 프록시 채택)

### 문제 (해결됨)

카탈로그 업로드 결과 URL 이 로컬 경로(`/uploads/xxx.pdf`)에서 **R2 절대 URL**(`https://pub-xxxx.r2.dev/catalog/<uuid>.pdf`)로 바뀌면서,
절대 URL 을 `pathname` 으로 환원하던 프론트 로직이 `/catalog/<uuid>.pdf` 라는 존재하지 않는 경로를 만들어 **404** 가 났습니다.

> 📌 **정정**: 이 문제는 PDF 에 한정되지 않습니다. 다운로드 섹션의 **카탈로그 이미지 다운로드**(`<a download>` href)도
> 동일한 환원 로직을 통과하므로 함께 영향을 받았습니다(백엔드 최초 보고는 "PDF 한정"으로 좁게 기술).

### 채택안 — `/r2/:path*` 전용 프리픽스 rewrite 프록시

`next.config.ts` 에 아래 rewrite 를 추가하고, 절대 URL → 동일출처 경로 변환을
`src/shared/lib/url/resolveSameOriginUrl.ts` 단일 유틸로 통합했습니다.

```ts
{ source: '/r2/:path*', destination: `https://${R2_PUBLIC_HOST}/:path*` }
```

변환 규칙:

| 입력                                          | 출력                     |
| --------------------------------------------- | ------------------------ |
| `/uploads/x.pdf` (상대경로, 레거시)           | `/uploads/x.pdf` (그대로) |
| `https://pub-xxx.r2.dev/catalog/a.pdf` (R2)   | `/r2/catalog/a.pdf`      |
| `https://api-host/uploads/a.pdf` (레거시 API) | `/uploads/a.pdf`         |
| 그 외 미지 오리진 절대 URL                    | 원본 그대로              |
| 파싱 실패                                     | 원본 그대로              |

> pathname 환원은 **`NEXT_PUBLIC_API_URL` 오리진에 한정**합니다(레거시 `/uploads/*` 서빙 주체).
> 미지 오리진까지 pathname 으로 깎으면, R2 호스트를 커스텀 도메인으로 교체했을 때 구 DB 레코드의
> `pub-*.r2.dev` URL 이 매칭에서 빠지며 `/catalog/<uuid>.pdf` 404 로 **조용히 회귀**합니다(§5 서두의 그 버그).
>
> 또한 이 유틸은 `pathname` 만 취하므로 `?search`·`#hash` 는 **의도적으로 폐기**됩니다.
> 현재는 퍼블릭 버킷(쿼리 없는 URL) 전제라 무해하나, presigned URL 도입 시 반드시 재검토해야 합니다.

**채택 사유**

- R2 대시보드에서 **CORS 규칙을 수동 설정할 필요가 없음** (버킷 설정이 코드 리뷰/버전관리 밖에 있어 재현·감사가 어려움)
- `<a download>` 속성은 **cross-origin 리소스에서 브라우저가 무시**하므로, 절대 URL 을 그대로 쓰면 다운로드가 아니라 탭 열기로 동작함 → 동일출처 프록시로만 회피 가능
- 프리픽스를 `/catalog` 가 아닌 **`/r2` 로 지정해 실제 페이지 라우트(`/catalog`, `/catalog/3d`) 와의 충돌을 회피**
- 기존 `/uploads/*` rewrite 를 그대로 두어 레거시 레코드 **하위호환 유지**

**미채택안 — R2 CORS 허용 + 절대 URL 직접 사용**

프록시 홉이 없어 대역·지연 면에서는 유리하지만, ① R2 대시보드 수동 CORS 설정이 배포 절차에 추가되고,
② `<a download>` 의 cross-origin 무시 문제가 남아 다운로드 UX 가 깨지므로 채택하지 않았습니다.

**트레이드오프**: 모든 PDF/다운로드 트래픽이 Next 서버를 경유하므로 무료 플랜의 대역·인스턴스 시간을 소모합니다.
카탈로그 트래픽 비중이 커지면 커스텀 도메인 + R2 CORS 조합으로 재검토합니다.

### 이미지 표시(`<img>`, `next/image`)는 절대 URL 직행 유지

프록시 대상은 **PDF fetch 와 다운로드 링크** 뿐입니다. 일반 이미지 표시(`<img>`, `next/image`)는
CORS 응답 헤더를 요구하지 않으므로 기존대로 R2 절대 URL 을 그대로 사용하며(`remotePatterns` 로 허용),
불필요한 프록시 홉을 만들지 않습니다.

> **예외 — 3D WebGL 텍스처는 CORS 가 필요합니다(미해결 / 후속 과제).**
> `src/views/catalog-3d/ui/Catalog3dScene.tsx` 의 `useTexture` 는 three.js `ImageLoader`(기본
> `crossOrigin='anonymous'`) 경로를 사용합니다. WebGL 텍스처 업로드는 오염되지 않은(non-tainted)
> 이미지를 요구하므로, 응답에 `Access-Control-Allow-Origin` 이 없으면 **image 타입 카탈로그 항목이
> 3D 뷰어에서 로드 실패**할 수 있습니다(PDF 에서 렌더된 페이지는 dataURL 이라 무관).
> 후속 과제: ① `pub-*.r2.dev` 응답의 `Access-Control-Allow-Origin` 실측 → ② 없으면 버킷 CORS 설정
> 또는 3D 텍스처 경로만 `/r2` 경유로 전환. **별도 이슈로 처리**하며 이번 PR 범위 밖입니다.

---

## 6. 무료 플랜 제약과 대응

> 아래 수치는 **작성 시점 기준**이며 변경될 수 있습니다. 배포 전 공식 문서에서 재확인하세요.

| 제약                     | 내용                                                                   | 대응                                                                                              |
| ------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 월 사용시간 한도         | 계정 단위로 무료 웹 서비스 인스턴스 시간이 합산되어 한도 초과 시 중단   | 웹 서비스 2개(server/web)가 시간을 함께 소모함을 인지. 초과 시 유료 플랜 또는 서비스 통합 검토     |
| 유휴 스핀다운            | 15분간 요청이 없으면 인스턴스가 잠들고, 다음 요청에서 콜드스타트(수십 초) | 첫 요청 지연을 UX 로 흡수(로딩 상태). 외부 핑으로 깨우는 방식은 사용시간을 소모하므로 권장하지 않음 |
| 무료 Postgres 보존 기간  | 무료 DB 는 생성 후 일정 기간이 지나면 만료·삭제될 수 있음               | 만료 전 백업(`pg_dump`) 필수. 운영 데이터가 중요해지는 시점에 유료 전환                            |
| 빌드 메모리 부족         | Next 16 빌드가 무료 인스턴스 메모리 한도에서 OOM 으로 실패할 수 있음    | `aircok-web` 에 `NODE_OPTIONS=--max-old-space-size=2048` 설정 후 재빌드                            |
| 디스크 휘발성            | 컨테이너 재시작 시 로컬 파일 소실                                       | 모든 업로드를 R2 로 일원화(완료). `public/uploads` 에 새 파일을 쓰지 않음                          |
| 콜드스타트 시 시드 재실행 | 재기동마다 migrate/seed 가 수행되어 기동이 수 초~수십 초 더 걸림        | 시드는 멱등이라 안전. 지연이 문제가 되면 시드를 배포 훅으로 분리 검토                              |
