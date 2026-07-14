import { prisma } from "../../src/config/prisma.js";

export async function limparBanco() {
  await prisma.projeto.deleteMany();
  await prisma.membroEmpresa.deleteMany();
  await prisma.empresa.deleteMany();
  await prisma.usuario.deleteMany();
}