/*
  Warnings:

  - A unique constraint covering the columns `[criadoPorId,nomeNormalizado]` on the table `Empresa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `criadoPorId` to the `Empresa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomeNormalizado` to the `Empresa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "criadoPorId" TEXT NOT NULL,
ADD COLUMN     "nomeNormalizado" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_criadoPorId_nomeNormalizado_key" ON "Empresa"("criadoPorId", "nomeNormalizado");
