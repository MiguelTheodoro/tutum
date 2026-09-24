-- DropForeignKey
ALTER TABLE "public"."File" DROP CONSTRAINT "File_analysis_fkey";

-- AlterTable
ALTER TABLE "public"."File" ALTER COLUMN "analysis" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_analysis_fkey" FOREIGN KEY ("analysis") REFERENCES "public"."Analysis"("identity") ON DELETE SET NULL ON UPDATE CASCADE;
