/*
  Warnings:

  - The values [Idea,Suggestion,Problem,Question,Praise] on the enum `FeedbackType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FeedbackType_new" AS ENUM ('IDEA', 'SUGGESTION', 'PROBLEM', 'QUESTION', 'PRAISE');
ALTER TABLE "public"."Feedback" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Feedback" ALTER COLUMN "type" TYPE "FeedbackType_new" USING ("type"::text::"FeedbackType_new");
ALTER TYPE "FeedbackType" RENAME TO "FeedbackType_old";
ALTER TYPE "FeedbackType_new" RENAME TO "FeedbackType";
DROP TYPE "public"."FeedbackType_old";
ALTER TABLE "Feedback" ALTER COLUMN "type" SET DEFAULT 'PRAISE';
COMMIT;

-- AlterTable
ALTER TABLE "Feedback" ALTER COLUMN "type" SET DEFAULT 'PRAISE';
