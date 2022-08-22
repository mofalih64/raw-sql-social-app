/*
  Warnings:

  - You are about to drop the column `vistor_id` on the `post_seen_by` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `posts` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_userId_fkey";

-- AlterTable
ALTER TABLE "post_seen_by" DROP COLUMN "vistor_id",
ADD COLUMN     "vistour_id" TEXT;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
