/*
  Warnings:

  - You are about to drop the column `hash` on the `File` table. All the data in the column will be lost.
  - Changed the type of `lastModified` on the `File` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."File" DROP COLUMN "hash",
DROP COLUMN "lastModified",
ADD COLUMN     "lastModified" INTEGER NOT NULL;
