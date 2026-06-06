-- Add ingredients JSON column to meals table
ALTER TABLE "meals" ADD COLUMN "ingredients" JSONB;
