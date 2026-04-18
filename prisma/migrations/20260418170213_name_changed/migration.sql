/*
  Warnings:

  - You are about to drop the column `workflowjson` on the `workflow` table. All the data in the column will be lost.
  - Added the required column `workflowJson` to the `workflow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "workflow" DROP COLUMN "workflowjson",
ADD COLUMN     "workflowJson" JSONB NOT NULL;
