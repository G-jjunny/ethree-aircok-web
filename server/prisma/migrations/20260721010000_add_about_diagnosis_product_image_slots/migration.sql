-- ProductImageSlot enum 에 소개/진단서비스 슬롯 2종 추가 (#148)
-- 순수 추가(additive) 마이그레이션 — 기존 enum 값/테이블/컬럼을 변경하거나 삭제하지 않는다.
--   ABOUT_MISSION: 소개 페이지 Mission 섹션 우측 이미지
--   DIAGNOSIS_HERO: 진단서비스 히어로 우측 이미지 카드
-- PostgreSQL 17: ALTER TYPE ... ADD VALUE 는 PG12+ 부터 트랜잭션 블록 내 실행이 가능하다.
--   (같은 트랜잭션에서 새 값을 *사용*할 수 없다는 제약만 있으며, 이 마이그레이션은 값을 사용하지 않는다.)

-- AlterEnum
ALTER TYPE "ProductImageSlot" ADD VALUE 'ABOUT_MISSION';
ALTER TYPE "ProductImageSlot" ADD VALUE 'DIAGNOSIS_HERO';
