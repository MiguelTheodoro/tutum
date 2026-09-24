/*
  Warnings:

  - You are about to drop the column `created_at` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `evaluation` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `evaluation_at` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `quality` on the `File` table. All the data in the column will be lost.
  - Added the required column `hash` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastModified` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."State" AS ENUM ('UNDEFINED', 'SAFE', 'MALICIOUS');

-- AlterTable
ALTER TABLE "public"."File" DROP COLUMN "created_at",
DROP COLUMN "evaluation",
DROP COLUMN "evaluation_at",
DROP COLUMN "quality",
ADD COLUMN     "hash" TEXT NOT NULL,
ADD COLUMN     "lastModified" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "public"."Quality";

-- CreateTable
CREATE TABLE "public"."Analysis" (
    "identity" TEXT NOT NULL,
    "evaluation" JSONB NOT NULL,
    "state" "public"."State" NOT NULL DEFAULT 'UNDEFINED',
    "fileId" INTEGER NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("identity")
);

-- CreateIndex
CREATE UNIQUE INDEX "Analysis_fileId_key" ON "public"."Analysis"("fileId");

-- AddForeignKey
ALTER TABLE "public"."Analysis" ADD CONSTRAINT "Analysis_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "public"."File"("identity") ON DELETE RESTRICT ON UPDATE CASCADE;
