/*
  Warnings:

  - Added the required column `videoId` to the `videos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "videos" ADD COLUMN     "videoId" TEXT NOT NULL;
