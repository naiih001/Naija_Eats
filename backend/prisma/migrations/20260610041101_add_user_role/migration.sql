-- Add role column to User table with default 'user'
ALTER TABLE "User" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'user';
