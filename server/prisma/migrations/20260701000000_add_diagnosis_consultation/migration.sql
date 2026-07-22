-- 진단 서비스 상담 신청 테이블 추가 (#91)
-- DiagnosisConsultation: 이름/전화번호로 공개 접수하고, 어드민이 상태 관리.
-- status: NEW(기본값) | IN_PROGRESS | DONE
-- consultationDate, consultant, notes 는 어드민이 PATCH 로 채운다.

-- CreateTable
CREATE TABLE "DiagnosisConsultation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "consultationDate" TIMESTAMP(3),
    "consultant" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiagnosisConsultation_pkey" PRIMARY KEY ("id")
);
