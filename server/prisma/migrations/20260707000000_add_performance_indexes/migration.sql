-- 조회 성능 개선용 인덱스 추가 (B1)
-- 목록/필터 쿼리의 orderBy/where 패턴에 맞춘 복합·단일 인덱스 11개.
-- 정렬 방향(DESC)은 각 목록의 기본 정렬과 일치시켜 인덱스 스캔 효율을 높인다.

-- CreateIndex
CREATE INDEX "NewsPost_published_date_idx" ON "NewsPost"("published", "date" DESC);

-- CreateIndex
CREATE INDEX "Inquiry_status_createdAt_idx" ON "Inquiry"("status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "FaqItem_categoryId_order_idx" ON "FaqItem"("categoryId", "order");

-- CreateIndex
CREATE INDEX "CatalogImage_order_idx" ON "CatalogImage"("order");

-- CreateIndex
CREATE INDEX "Partner_order_idx" ON "Partner"("order");

-- CreateIndex
CREATE INDEX "TeamImage_order_idx" ON "TeamImage"("order");

-- CreateIndex
CREATE INDEX "TimelineItem_year_month_idx" ON "TimelineItem"("year" DESC, "month" DESC);

-- CreateIndex
CREATE INDEX "CoreValue_order_idx" ON "CoreValue"("order");

-- CreateIndex
CREATE INDEX "ServiceImage_order_idx" ON "ServiceImage"("order");

-- CreateIndex
CREATE INDEX "DiagnosisImage_order_idx" ON "DiagnosisImage"("order");

-- CreateIndex
CREATE INDEX "DiagnosisConsultation_status_createdAt_idx" ON "DiagnosisConsultation"("status", "createdAt" DESC);
