-- CreateTable
CREATE TABLE "MapSetting" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MapSetting_pkey" PRIMARY KEY ("id")
);
