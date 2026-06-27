-- AlterTable: Add active column to State
ALTER TABLE "State" ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable: Add active column to City
ALTER TABLE "City" ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT false;

-- Ativar apenas Pará (id=15) e Belém (ibgeCode=1501402)
UPDATE "State" SET "active" = true WHERE "id" = '15';
UPDATE "City" SET "active" = true WHERE "ibgeCode" = '1501402';
