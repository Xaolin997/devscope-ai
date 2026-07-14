/*
  Warnings:

  - A unique constraint covering the columns `[empresaId,nomeNormalizado]` on the table `Projeto` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nomeNormalizado` to the `Projeto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Projeto" ADD COLUMN     "nomeNormalizado" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Projeto_empresaId_idx" ON "Projeto"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Projeto_empresaId_nomeNormalizado_key" ON "Projeto"("empresaId", "nomeNormalizado");
