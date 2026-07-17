import { prisma } from "../../config/prisma.js";

type DadosCriacaoUsuario = {
  nome: string;
  email: string;
  senhaHash: string;
};

export async function buscarUsuarioPorEmail(email: string) {
  return prisma.usuario.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      nome: true,
      email: true,
      senhaHash: true,
      criadoEm: true,
    },
  });
}

export async function criarUsuario(dados: DadosCriacaoUsuario) {
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
