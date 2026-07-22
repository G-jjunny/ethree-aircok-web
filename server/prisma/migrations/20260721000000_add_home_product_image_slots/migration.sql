-- ProductImageSlot enum 에 홈 섹션 슬롯 5종 추가 (#148)
-- 순수 추가(additive) 마이그레이션 — 기존 enum 값/테이블/컬럼을 변경하거나 삭제하지 않는다.
--   HOME_VALUE_1 ~ HOME_VALUE_4: 홈 "Our Value" 이미지 카드 4장
--     (카피 변경 가능성 때문에 의미 기반이 아닌 위치 기반 명명)
--   HOME_REPORT_ILLUST: 홈 "FREE REPORT" 섹션 일러스트
-- PostgreSQL 17: ALTER TYPE ... ADD VALUE 는 PG12+ 부터 트랜잭션 블록 내 실행이 가능하다.
--   (같은 트랜잭션에서 새 값을 *사용*할 수 없다는 제약만 있으며, 이 마이그레이션은 값을 사용하지 않는다.)

-- AlterEnum
ALTER TYPE "ProductImageSlot" ADD VALUE 'HOME_VALUE_1';
ALTER TYPE "ProductImageSlot" ADD VALUE 'HOME_VALUE_2';
ALTER TYPE "ProductImageSlot" ADD VALUE 'HOME_VALUE_3';
ALTER TYPE "ProductImageSlot" ADD VALUE 'HOME_VALUE_4';
ALTER TYPE "ProductImageSlot" ADD VALUE 'HOME_REPORT_ILLUST';
