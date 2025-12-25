-- CreateTable
CREATE TABLE "Size" (
    "id" TEXT NOT NULL,
    "size" VARCHAR(100) NOT NULL,
    "createdOn" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Size_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Size_size_idx" ON "Size"("size");

-- CreateIndex
CREATE INDEX "Size_createdOn_idx" ON "Size"("createdOn" DESC);
