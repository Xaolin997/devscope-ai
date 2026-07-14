import { prisma } from "../../config/prisma.js";

export async function buscarUsuarioPorEmail(email: string) {
  return prisma.usuario.findUnique({
    where: { email },
  });
}

export async function criarUsuario(dados: {
  nome: string;
  email: string;
  senhaHash: string;
}) {
  return prisma.usuario.create({
    data: dados,
    select: {
      id: true,
      nome: true,
      email: true,
      criadoEm: true,
    },
  });
}
