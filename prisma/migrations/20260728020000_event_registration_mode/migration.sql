ALTER TABLE "events" ADD COLUMN "registrationMode" TEXT NOT NULL DEFAULT 'INTERNAL';
ALTER TABLE "events" ADD COLUMN "registrationLink" TEXT;
