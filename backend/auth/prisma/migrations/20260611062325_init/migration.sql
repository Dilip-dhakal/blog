/*
  Warnings:

  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "blogFile" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profiePicture" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
