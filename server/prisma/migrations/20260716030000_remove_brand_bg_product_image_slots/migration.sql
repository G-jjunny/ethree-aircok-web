-- ProductImageSlot enum 에서 브랜드 배경 슬롯 2종 제거 (#122)
-- /services 리디자인으로 BRAND_BG_INDOOR / BRAND_BG_KITCHEN 슬롯이 폐기됨.
-- 새 레이아웃은 해당 위치에 배경 이미지를 두지 않으므로 프론트도 이 슬롯을 참조하지 않는다.
--
-- PostgreSQL 은 ALTER TYPE ... DROP VALUE 를 지원하지 않는다. 따라서 Prisma 가 enum 값 제거 시
-- 생성하는 표준 swap 패턴(신규 타입 생성 → 컬럼 타입 전환 → 구 타입 DROP → 리네임)을 사용한다.
--
-- 선행 DELETE 가 필요한 이유:
--   USING ("slot"::text::"ProductImageSlot_new") 캐스팅은 제거 대상 값을 가진 행이 하나라도 남아 있으면
--   invalid input value 로 실패한다. 현재 DB 에 해당 행은 0건이라 사실상 no-op 이지만,
--   다른 환경(로컬/스테이징)에서 값이 남아 있을 가능성에 대비해 방어적으로 선행 삭제한다.
--
-- 데이터 영향:
--   BRAND_BG_* 행 0건 삭제. KITCHEN_AIRSHIELD_TECH 행(현재 1건)을 포함한 잔여 11종 슬롯의 행은 모두 보존된다.
--   R2 원본 이미지는 잔존하므로 실질 데이터 손실 없음.
--
-- 종속 unique 인덱스(ProductSectionImage_slot_key) 를 명시적으로 DROP/CREATE 하지 않는 이유:
--   ALTER COLUMN ... TYPE 은 해당 컬럼에 걸린 인덱스를 Postgres 가 동일한 이름으로 자동 재구축한다.
--   수동으로 재생성하면 인덱스명이 Prisma 기대값과 어긋나 drift 검사에 걸릴 위험이 있으므로 자동 재구축에 맡긴다.
--
-- slot 컬럼에는 DEFAULT 가 없으므로 DROP DEFAULT / SET DEFAULT 구문은 불필요하다.

-- 제거 대상 값을 가진 행 선삭제 (현재 0건, 방어적)
DELETE FROM "ProductSectionImage" WHERE "slot" IN ('BRAND_BG_INDOOR','BRAND_BG_KITCHEN');

-- AlterEnum
BEGIN;
CREATE TYPE "ProductImageSlot_new" AS ENUM ('MONITORING_DASHBOARD', 'MONITORING_STATS', 'MONITORING_DEVICES', 'MONITORING_DID', 'DIAGNOSIS_VISIT', 'DIAGNOSIS_ANALYSIS', 'DIAGNOSIS_REPORT', 'DIAGNOSIS_PROPOSAL', 'KITCHEN_BLACKBOX_PRODUCT', 'KITCHEN_BLACKBOX_DID', 'KITCHEN_AIRSHIELD_TECH');
ALTER TABLE "ProductSectionImage" ALTER COLUMN "slot" TYPE "ProductImageSlot_new" USING ("slot"::text::"ProductImageSlot_new");
DROP TYPE "ProductImageSlot";
ALTER TYPE "ProductImageSlot_new" RENAME TO "ProductImageSlot";
COMMIT;
