import { prisma } from "../config/prisma.js";

export async function criarEmpresaComAdministrador(
  nome: string,
  usuarioId: string
) {
  return prisma.empresa.create({
    data: {
      nome,
      membros: {
        create: {
          usuarioId,
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
          usuarioId
        }
      }
    },
    select: {
      id: true,
      nome: true,
      criadoEm: true,
      atualizadoEm: true,
      membros: {
        where: {
          usuarioId
        },
        select: {
          cargo: true
        }
      },
      _count: {
        select: {
          membros: true,
          projetos: true
        }
      }
    },
    orderBy: {
      criadoEm: "desc"
    }
  });
}