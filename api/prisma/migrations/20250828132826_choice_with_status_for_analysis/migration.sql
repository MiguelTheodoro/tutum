-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('PROCESSED', 'IN_PROCESSING', 'UNPROCESSED');

-- AlterTable
ALTER TABLE "public"."Analysis" ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'UNPROCESSED';
