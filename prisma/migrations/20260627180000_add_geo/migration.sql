-- CreateTable
CREATE TABLE "State" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "City" (
    "id" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ibgeCode" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Neighborhood" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Neighborhood_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "State_code_key" ON "State"("code");

-- CreateIndex
CREATE UNIQUE INDEX "City_ibgeCode_key" ON "City"("ibgeCode");

-- CreateIndex
CREATE INDEX "City_stateId_idx" ON "City"("stateId");

-- CreateIndex
CREATE UNIQUE INDEX "Neighborhood_cityId_name_key" ON "Neighborhood"("cityId", "name");

-- CreateIndex
CREATE INDEX "Neighborhood_cityId_idx" ON "Neighborhood"("cityId");

-- AddForeignKey
ALTER TABLE "City" ADD CONSTRAINT "City_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Neighborhood" ADD CONSTRAINT "Neighborhood_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop old indexes on Road
DROP INDEX "Road_neighborhood_idx";
DROP INDEX "Road_neighborhood_name_key";

-- Add neighborhoodId to Road
ALTER TABLE "Road" ADD COLUMN "neighborhoodId" TEXT;

-- Populate neighborhoodId from existing data
DO $$
DECLARE
    r RECORD;
    n_id TEXT;
BEGIN
    FOR r IN SELECT id, neighborhood FROM "Road" WHERE "neighborhoodId" IS NULL
    LOOP
        -- Try to find existing neighborhood
        SELECT id INTO n_id FROM "Neighborhood" WHERE name = r.neighborhood LIMIT 1;
        IF n_id IS NULL THEN
            -- Create a placeholder neighborhood in a default city if needed
            INSERT INTO "Neighborhood" (id, "cityId", name)
            SELECT gen_random_uuid()::text, (SELECT id FROM "City" LIMIT 1), r.neighborhood
            ON CONFLICT ("cityId", name) DO NOTHING
            RETURNING id INTO n_id;
            -- If still null (no cities yet), use a dummy
            IF n_id IS NULL THEN
                SELECT id INTO n_id FROM "Neighborhood" WHERE name = r.neighborhood LIMIT 1;
            END IF;
        END IF;
        UPDATE "Road" SET "neighborhoodId" = n_id WHERE id = r.id;
    END LOOP;
END $$;

-- Now make neighborhoodId required and drop old neighborhood column
ALTER TABLE "Road" ALTER COLUMN "neighborhoodId" SET NOT NULL;
ALTER TABLE "Road" DROP COLUMN "neighborhood";

-- Create new indexes on Road
CREATE INDEX "Road_neighborhoodId_idx" ON "Road"("neighborhoodId");
CREATE UNIQUE INDEX "Road_neighborhoodId_name_key" ON "Road"("neighborhoodId", "name");

-- AddForeignKey for Road -> Neighborhood
ALTER TABLE "Road" ADD CONSTRAINT "Road_neighborhoodId_fkey" FOREIGN KEY ("neighborhoodId") REFERENCES "Neighborhood"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add FK columns to ServiceRecord
ALTER TABLE "ServiceRecord" ADD COLUMN "roadId" TEXT;
ALTER TABLE "ServiceRecord" ADD COLUMN "supervisorId" TEXT;
ALTER TABLE "ServiceRecord" ADD COLUMN "recorderId" TEXT;

-- Populate roadId from existing road data
DO $$
DECLARE
    r RECORD;
    rd_id TEXT;
BEGIN
    FOR r IN SELECT id, road, neighborhood FROM "ServiceRecord" WHERE "roadId" IS NULL
    LOOP
        SELECT id INTO rd_id FROM "Road" WHERE name = r.road LIMIT 1;
        UPDATE "ServiceRecord" SET "roadId" = rd_id WHERE id = r.id;
    END LOOP;
END $$;

-- Drop old string columns and indexes
DROP INDEX "ServiceRecord_neighborhood_road_idx";
ALTER TABLE "ServiceRecord" DROP COLUMN "neighborhood";
ALTER TABLE "ServiceRecord" DROP COLUMN "road";
ALTER TABLE "ServiceRecord" DROP COLUMN "supervisor";
ALTER TABLE "ServiceRecord" DROP COLUMN "recorder";

-- Create new indexes on ServiceRecord
CREATE INDEX "ServiceRecord_roadId_idx" ON "ServiceRecord"("roadId");

-- Add FKs for ServiceRecord -> Road, TeamMember
ALTER TABLE "ServiceRecord" ADD CONSTRAINT "ServiceRecord_roadId_fkey" FOREIGN KEY ("roadId") REFERENCES "Road"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ServiceRecord" ADD CONSTRAINT "ServiceRecord_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ServiceRecord" ADD CONSTRAINT "ServiceRecord_recorderId_fkey" FOREIGN KEY ("recorderId") REFERENCES "TeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
