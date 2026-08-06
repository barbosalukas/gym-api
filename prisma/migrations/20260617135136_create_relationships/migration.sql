/*
  Warnings:

  - Added the required column `gym_id` to the `check_ins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `check_ins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- AlterTable
ALTER TABLE "check_ins" ADD COLUMN     "gym_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- AlterTable
ALTER TABLE "gyms" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
