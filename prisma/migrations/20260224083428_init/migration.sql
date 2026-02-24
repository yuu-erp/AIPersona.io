/*
  Warnings:

  - You are about to drop the column `baseFaceImageUrl` on the `ai_personas` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `ai_personas` table. All the data in the column will be lost.
  - You are about to drop the column `isTrained` on the `ai_personas` table. All the data in the column will be lost.
  - You are about to drop the column `caption` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `errorLog` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `platformPostId` on the `posts` table. All the data in the column will be lost.
  - The `status` column on the `posts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `passwordHash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `social_channels` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[customerStripeId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `baseFaceUrl` to the `ai_personas` table without a default value. This is not possible if the table is not empty.
  - Made the column `featuresConfig` on table `ai_personas` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('FREE', 'PRO', 'ULTRA');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PROCESSING', 'PENDING_APPROVAL', 'REJECTED', 'SCHEDULED', 'PUBLISHING', 'PUBLISHED', 'FAILED');

-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('TIKTOK', 'FACEBOOK', 'INSTAGRAM', 'TWITTER', 'YOUTUBE');

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_channelId_fkey";

-- DropForeignKey
ALTER TABLE "social_channels" DROP CONSTRAINT "social_channels_userId_fkey";

-- AlterTable
ALTER TABLE "ai_personas" DROP COLUMN "baseFaceImageUrl",
DROP COLUMN "description",
DROP COLUMN "isTrained",
ADD COLUMN     "baseFaceUrl" TEXT NOT NULL,
ALTER COLUMN "featuresConfig" SET NOT NULL;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "caption",
DROP COLUMN "errorLog",
DROP COLUMN "platformPostId",
ADD COLUMN     "aiMetadata" JSONB,
ADD COLUMN     "aiPrompt" TEXT,
ADD COLUMN     "content" TEXT,
ALTER COLUMN "mediaUrl" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "PostStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "passwordHash",
DROP COLUMN "provider",
ADD COLUMN     "customerStripeId" TEXT,
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "plan" "PlanType" NOT NULL DEFAULT 'FREE',
ADD COLUMN     "planExpiresAt" TIMESTAMP(3),
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "social_channels";

-- CreateTable
CREATE TABLE "social_accounts" (
    "id" TEXT NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "platformId" TEXT NOT NULL,
    "accountName" TEXT,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "isModerationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_quotas" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "videoCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "daily_quotas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "social_accounts_platform_platformId_key" ON "social_accounts"("platform", "platformId");

-- CreateIndex
CREATE UNIQUE INDEX "daily_quotas_userId_date_key" ON "daily_quotas"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "users_customerStripeId_key" ON "users"("customerStripeId");

-- AddForeignKey
ALTER TABLE "social_accounts" ADD CONSTRAINT "social_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "social_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_quotas" ADD CONSTRAINT "daily_quotas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
