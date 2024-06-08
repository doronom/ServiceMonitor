-- CreateTable
CREATE TABLE "Monitor" (
    "_id" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "lastOfflineTime" TIMESTAMP(3),

    CONSTRAINT "Monitor_pkey" PRIMARY KEY ("_id")
);
