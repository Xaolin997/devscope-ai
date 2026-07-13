import { prisma } from "../config/prisma.js";

type DadosCriacaoEmpresa = {
  nome: string;
  nomeNormalizado: string;
  usuarioId: string;
};

export async function criarEmpresaComAdministrador(
  dados: DadosCriacaoEmpresa
) {
  return prisma.empresa.create({
    data: {
      nome: dados.nome,
      nomeNormalizado: dados.nomeNormalizado,
      criadoPorId: dados.usuarioId,
      membros: {
        create: {
          usuarioId: dados.usuarioId,
          cargo: "ADMIN"
        }
      }
    },
    select: {
      id: true,
      nome: true,
      criadoEm: true,
      membros: {
        select: {
          cargo: true,
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          }
        }
      }
    }
  });
}

export async function listarEmpresasDoUsuario(usuarioId: string) {
  return prisma.empresa.findMany({
    where: {
      membros: {
        some: {
          usuarioId,
        },
      },
    },
    select: {
      id: true,
      nome: true,
      criadoEm: true,
      atualizadoEm: true,
      membros: {
        where: {
          usuarioId,
        },
        select: {
          cargo: true,
        },
      },
      _count: {
        select: {
          membros: true,
          projetos: true,
        },
      },
    },
    orderBy: {
      criadoEm: "desc",
    },
  });
}
