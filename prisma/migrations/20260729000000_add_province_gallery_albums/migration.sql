-- Optional province ownership keeps all existing albums valid and unassigned.
ALTER TABLE "gallery_albums" ADD COLUMN "provinceId" TEXT REFERENCES "provinces"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "gallery_albums_provinceId_idx" ON "gallery_albums"("provinceId");
