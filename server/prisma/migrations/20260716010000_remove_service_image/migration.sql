-- 구 ServiceImage 기능 제거 (#122)
-- /services 페이지 리디자인으로 브로슈어 이미지 세로 나열 기능이 폐기됨.
-- 새 /services 는 AirDevice / ProductSectionImage 를 사용하며 ServiceImage 를 참조하지 않는다.
-- 테이블 내 3건은 삭제되나 R2 원본 이미지는 잔존하므로 실질 데이터 손실 없음.
-- DROP TABLE 은 종속 인덱스(ServiceImage_order_idx)도 함께 제거한다.

-- DropTable
DROP TABLE "ServiceImage";
