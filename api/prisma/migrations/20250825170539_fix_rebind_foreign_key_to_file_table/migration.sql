/*
  Warnings:

  - You are about to drop the column `fileId` on the `Analysis` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[analysis]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `analysis` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Analysis" DROP CONSTRAINT "Analysis_fileId_fkey";

-- DropIndex
DROP INDEX "public"."Analysis_fileId_key";

-- AlterTable
ALTER TABLE "public"."Analysis" DROP COLUMN "fileId",
ALTER COLUMN "evaluation" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."File" ADD COLUMN     "analysis" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "File_analysis_key" ON "public"."File"("analysis");

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_analysis_fkey" FOREIGN KEY ("analysis") REFERENCES "public"."Analysis"("identity") ON DELETE RESTRICT ON UPDATE CASCADE;
