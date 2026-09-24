/*
  Warnings:

  - The primary key for the `File` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `analysis` on the `File` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[file]` on the table `Analysis` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `file` to the `Analysis` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."File" DROP CONSTRAINT "File_analysis_fkey";

-- DropIndex
DROP INDEX "public"."File_analysis_key";

-- AlterTable
ALTER TABLE "public"."Analysis" ADD COLUMN     "file" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."File" DROP CONSTRAINT "File_pkey",
DROP COLUMN "analysis",
ALTER COLUMN "identity" DROP DEFAULT,
ALTER COLUMN "identity" SET DATA TYPE TEXT,
ADD CONSTRAINT "File_pkey" PRIMARY KEY ("identity");
DROP SEQUENCE "File_identity_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Analysis_file_key" ON "public"."Analysis"("file");

-- AddForeignKey
ALTER TABLE "public"."Analysis" ADD CONSTRAINT "Analysis_file_fkey" FOREIGN KEY ("file") REFERENCES "public"."File"("identity") ON DELETE RESTRICT ON UPDATE CASCADE;
