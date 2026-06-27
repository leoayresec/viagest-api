-- DropForeignKey: ServiceRecord -> TeamMember
ALTER TABLE "ServiceRecord" DROP CONSTRAINT "ServiceRecord_supervisorId_fkey";
ALTER TABLE "ServiceRecord" DROP CONSTRAINT "ServiceRecord_recorderId_fkey";

-- AddForeignKey: ServiceRecord -> User (supervisor)
ALTER TABLE "ServiceRecord" ADD CONSTRAINT "ServiceRecord_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: ServiceRecord -> User (recorder)
ALTER TABLE "ServiceRecord" ADD CONSTRAINT "ServiceRecord_recorderId_fkey" FOREIGN KEY ("recorderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- DropTable
DROP TABLE "TeamMember";

-- DropEnum
DROP TYPE "TeamRole";
