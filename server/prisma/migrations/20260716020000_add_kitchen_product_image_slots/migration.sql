-- ProductImageSlot enum 에 주방 섹션 슬롯 3종 추가 (#122)
-- 순수 추가(additive) 마이그레이션 — 기존 enum 값/테이블/컬럼을 변경하거나 삭제하지 않는다.
--   KITCHEN_BLACKBOX_PRODUCT: 블랙박스 제품 사진
--   KITCHEN_BLACKBOX_DID: 조리실 오염 현황 DID
--   KITCHEN_AIRSHIELD_TECH: 에어쉴드 특허 급기 기술
-- PostgreSQL 17: ALTER TYPE ... ADD VALUE 는 PG12+ 부터 트랜잭션 블록 내 실행이 가능하다.
--   (같은 트랜잭션에서 새 값을 *사용*할 수 없다는 제약만 있으며, 이 마이그레이션은 값을 사용하지 않는다.)

-- AlterEnum
ALTER TYPE "ProductImageSlot" ADD VALUE 'KITCHEN_BLACKBOX_PRODUCT';
ALTER TYPE "ProductImageSlot" ADD VALUE 'KITCHEN_BLACKBOX_DID';
ALTER TYPE "ProductImageSlot" ADD VALUE 'KITCHEN_AIRSHIELD_TECH';
