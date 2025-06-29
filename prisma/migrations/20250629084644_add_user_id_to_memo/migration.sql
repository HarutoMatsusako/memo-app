/*
  Warnings:

  - Added the required column `userId` to the `Memo` table without a default value. This is not possible if the table is not empty.

*/
-- Delete existing data
DELETE FROM "Memo";

-- AlterTable
ALTER TABLE "Memo" ADD COLUMN     "userId" TEXT NOT NULL;
