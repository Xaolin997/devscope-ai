import { prisma } from "../../config/prisma.js";

type DadosCriacaoEmpresa = {
  nome: string;
  nomeNormalizado: string;
  usuarioId: string;
};

type DadosAtualizacaoEmpresa = {
  empresaId: string;
  nome: string;
  nomeNormalizado: string;
};

export async function criarEmpresaComAdministrador(dados: DadosCriacaoEmpresa) {
  return prisma.empresa.create({
    data: {
      nome: dados.nome,
      nomeNormalizado: dados.nomeNormalizado,
      criadoPorId: dados.usuarioId,

      membros: {
        create: {
          usuarioId: dados.usuarioId,
          cargo: "ADMIN",
        },
      },
    },

    select: {
      id: true,
      nome: true,
      criadoEm: true,
      atualizadoEm: true,

      membros: {
        select: {
          cargo: true,

          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
      },
    },
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

export async function buscarEmpresaPorId(empresaId: string, usuarioId: string) {
  return prisma.empresa.findFirst({
    where: {
      id: empresaId,

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
        select: {
          cargo: true,
          criadoEm: true,

          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
      },

      projetos: {
        select: {
          id: true,
          nome: true,
          descricao: true,
          status: true,
          criadoEm: true,
        },

        orderBy: {
          criadoEm: "desc",
        },
      },

      _count: {
        select: {
          membros: true,
          projetos: true,
        },
      },
    },
  });
}

export async function buscarMembroDaEmpresa(
  empresaId: string,
  usuarioId: string,
) {
  return prisma.membroEmpresa.findUnique({
    where: {
      usuarioId_empresaId: {
        usuarioId,
        empresaId,
      },
    },

    select: {
      id: true,
      cargo: true,
    },
  });
}

export async function atualizarEmpresa(dados: DadosAtualizacaoEmpresa) {
  return prisma.empresa.update({
    where: {
      id: dados.empresaId,
    },

    data: {
      nome: dados.nome,
      nomeNormalizado: dados.nomeNormalizado,
    },

    select: {
      id: true,
      nome: true,
      criadoEm: true,
      atualizadoEm: true,
    },
  });
}

export async function excluirEmpresa(empresaId: string) {
  return prisma.empresa.delete({
    where: {
      id: empresaId,
    },

    select: {
      id: true,
      nome: true,
    },
  });
}
