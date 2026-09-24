-- DropForeignKey
ALTER TABLE "public"."Analysis" DROP CONSTRAINT "Analysis_file_fkey";

-- AddForeignKey
ALTER TABLE "public"."Analysis" ADD CONSTRAINT "Analysis_file_fkey" FOREIGN KEY ("file") REFERENCES "public"."File"("identity") ON DELETE CASCADE ON UPDATE CASCADE;
