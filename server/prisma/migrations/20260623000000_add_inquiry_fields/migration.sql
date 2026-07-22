-- 문의하기 동적 폼 빌더 (#33)
-- 1) InquiryField 테이블 신설 + key 유니크 인덱스
-- 2) Inquiry 에 answers(JSONB) 추가, 고정 컬럼 nullable 화, 기존 행 백필
-- 3) 기본 5필드 시드 (ON CONFLICT DO NOTHING)

-- CreateTable
CREATE TABLE "InquiryField" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "placeholder" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InquiryField_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InquiryField_key_key" ON "InquiryField"("key");

-- AlterTable: answers 컬럼 추가 (NOT NULL DEFAULT '{}')
ALTER TABLE "Inquiry" ADD COLUMN "answers" JSONB NOT NULL DEFAULT '{}';

-- 백필: 기존 행의 고정 컬럼 값을 answers 로 보존.
-- NULL 인 컬럼은 빈 문자열로 정규화하여 answers 값 타입(문자열) 일관성을 유지한다.
UPDATE "Inquiry"
SET "answers" = jsonb_build_object(
    'company', COALESCE("company", ''),
    'name', COALESCE("name", ''),
    'phone', COALESCE("phone", ''),
    'email', COALESCE("email", ''),
    'message', COALESCE("message", '')
);

-- AlterTable: 고정 컬럼 NOT NULL 제약 제거 (호환 목적 잔존, 데이터는 유지)
ALTER TABLE "Inquiry" ALTER COLUMN "company" DROP NOT NULL;
ALTER TABLE "Inquiry" ALTER COLUMN "name" DROP NOT NULL;
ALTER TABLE "Inquiry" ALTER COLUMN "phone" DROP NOT NULL;
ALTER TABLE "Inquiry" ALTER COLUMN "email" DROP NOT NULL;
ALTER TABLE "Inquiry" ALTER COLUMN "message" DROP NOT NULL;

-- 기본 5필드 시드. id 는 cuid 를 SQL 에서 생성하기 어려우므로 고정 문자열 id 를 사용한다.
-- key 유니크 충돌(ON CONFLICT) 시 무시하여 재실행/기존환경 안전성을 보장한다.
INSERT INTO "InquiryField" ("id", "key", "label", "type", "required", "placeholder", "order", "createdAt", "updatedAt")
VALUES
    ('field_company', 'company', '회사/기관명', 'text', true, NULL, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('field_name', 'name', '담당자명', 'text', true, NULL, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('field_phone', 'phone', '전화번호', 'tel', true, NULL, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('field_email', 'email', '이메일', 'email', true, NULL, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('field_message', 'message', '요청사항', 'textarea', true, NULL, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO NOTHING;
