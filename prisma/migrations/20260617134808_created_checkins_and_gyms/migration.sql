-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()::text;

-- CreateTable
CREATE TABLE "check_ins" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validated_at" TIMESTAMP(3),

    CONSTRAINT "check_ins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gyms" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "phone" TEXT,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "gyms_pkey" PRIMARY KEY ("id")
);
