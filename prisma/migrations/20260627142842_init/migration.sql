-- CreateEnum
CREATE TYPE "UserProfile" AS ENUM ('admin', 'apontador');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('limpeza', 'obs_limpeza', 'escavacao', 'colchao_areia', 'tubo', 'manta_bidim', 'aterro', 'obs_drenagem', 'motor', 'pv', 'bl', 'obs_pvbl', 'espinha_bl', 'terrap', 'obs_terrap', 'subbase', 'cbuq', 'binder', 'pintura_ligacao', 'obs_pav', 'tampao_70', 'fresagem', 'remendo_profundo', 'obs_recuperacao', 'demolicao_calcada', 'demolicao_meiofio', 'colchao_areia_meiofio', 'demolicao_linha_agua', 'linha_agua', 'urb', 'obs_urb', 'urb_controle', 'redes_auxiliares', 'rede_domiciliar', 'info_adicionais');

-- CreateEnum
CREATE TYPE "TeamRole" AS ENUM ('encarregado', 'apontador');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profile" "UserProfile" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRecord" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "road" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "supervisor" TEXT,
    "recorder" TEXT,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "ServiceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Road" (
    "id" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lengthM" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "widthM" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ativa',

    CONSTRAINT "Road_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "TeamRole" NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spreadsheet_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "spreadsheet_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_columns" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "columnKey" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "expectedHeaders" TEXT[],
    "dataType" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "unique" BOOLEAN NOT NULL DEFAULT false,
    "defaultValue" TEXT,
    "unit" TEXT,
    "allowedValues" TEXT[],
    "weight" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "template_columns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "validation_rules" (
    "id" TEXT NOT NULL,
    "columnId" TEXT NOT NULL,
    "ruleType" TEXT NOT NULL,
    "ruleValue" TEXT NOT NULL,
    "errorMessage" TEXT NOT NULL,
    "severity" TEXT NOT NULL,

    CONSTRAINT "validation_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field_mappings" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "sourceColumn" TEXT NOT NULL,
    "targetColumn" TEXT NOT NULL,
    "transformRule" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "field_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_histories" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "totalRows" INTEGER NOT NULL,
    "importedRows" INTEGER NOT NULL,
    "errorRows" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "importedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "importedBy" TEXT NOT NULL,

    CONSTRAINT "import_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_errors" (
    "id" TEXT NOT NULL,
    "importId" TEXT NOT NULL,
    "rowNumber" INTEGER NOT NULL,
    "columnName" TEXT,
    "errorType" TEXT NOT NULL,
    "errorMessage" TEXT NOT NULL,
    "rawValue" TEXT,

    CONSTRAINT "import_errors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imported_data" (
    "id" TEXT NOT NULL,
    "importId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "rawData" JSONB,
    "rowNumber" INTEGER NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "imported_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE INDEX "ServiceRecord_date_idx" ON "ServiceRecord"("date");

-- CreateIndex
CREATE INDEX "ServiceRecord_neighborhood_road_idx" ON "ServiceRecord"("neighborhood", "road");

-- CreateIndex
CREATE INDEX "ServiceRecord_recorder_date_idx" ON "ServiceRecord"("recorder", "date");

-- CreateIndex
CREATE INDEX "Road_neighborhood_idx" ON "Road"("neighborhood");

-- CreateIndex
CREATE UNIQUE INDEX "Road_neighborhood_name_key" ON "Road"("neighborhood", "name");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_name_role_key" ON "TeamMember"("name", "role");

-- AddForeignKey
ALTER TABLE "ServiceRecord" ADD CONSTRAINT "ServiceRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_columns" ADD CONSTRAINT "template_columns_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "spreadsheet_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "validation_rules" ADD CONSTRAINT "validation_rules_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "template_columns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "field_mappings" ADD CONSTRAINT "field_mappings_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "spreadsheet_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_histories" ADD CONSTRAINT "import_histories_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "spreadsheet_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "import_errors" ADD CONSTRAINT "import_errors_importId_fkey" FOREIGN KEY ("importId") REFERENCES "import_histories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imported_data" ADD CONSTRAINT "imported_data_importId_fkey" FOREIGN KEY ("importId") REFERENCES "import_histories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
