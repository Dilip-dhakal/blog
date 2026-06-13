/*
  Warnings:

  - You are about to drop the column `profiePicture` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "profiePicture",
ADD COLUMN     "profilePicture" TEXT;
