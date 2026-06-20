/*
  Warnings:

  - The primary key for the `Otp` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Otp` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Otp` table. All the data in the column will be lost.
  - Added the required column `hashedPassword` to the `Otp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Otp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profilePicture` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Otp_email_key";

-- AlterTable
ALTER TABLE "Otp" DROP CONSTRAINT "Otp_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
ADD COLUMN     "hashedPassword" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "profilePicture" TEXT NOT NULL,
ADD CONSTRAINT "Otp_pkey" PRIMARY KEY ("email");
