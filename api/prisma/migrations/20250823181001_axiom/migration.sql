-- CreateEnum
CREATE TYPE "public"."Quality" AS ENUM ('UNDEFINED', 'SAFE', 'MALICIOUS');

-- CreateTable
CREATE TABLE "public"."File" (
    "identity" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "evaluation_at" TIMESTAMP(3) NOT NULL,
    "evaluation" JSONB NOT NULL,
    "quality" "public"."Quality" NOT NULL DEFAULT 'UNDEFINED',

    CONSTRAINT "File_pkey" PRIMARY KEY ("identity")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_name_key" ON "public"."File"("name");
