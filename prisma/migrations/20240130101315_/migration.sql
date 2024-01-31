/*
  Warnings:

  - A unique constraint covering the columns `[content]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Role_content_key" ON "Role"("content");
