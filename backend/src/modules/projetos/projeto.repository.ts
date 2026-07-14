import { prisma } from "../../config/prisma.js";

type DadosCriacaoProjeto = {
  empresaId: string;
  nome: string;
  nomeNormalizado: string;
  descricao?: string;
  status?: "ATIVO" | "PAUSADO" | "CONCLUIDO" | "CANCELADO";
  dataInicio?: Date;
  dataLimite?: Date;
};

type DadosAtualizacaoProjeto = {
  projetoId: string;
  nome?: string;
  nomeNormalizado?: string;
  descricao?: string | null;
  status?: "ATIVO" | "PAUSADO" | "CONCLUIDO" | "CANCELADO";
  dataInicio?: Date | null;
  dataLimite?: Date | null;
};

export async function buscarVinculoEmpresa(
  empresaId: string,
  usuarioId: string
) {
  return prisma.membroEmpresa.findUnique({
    where: {
      usuarioId_empresaId: {
        usuarioId,
        empresaId
      }
    },
    select: {
      id: true,
      cargo: true
    }
  });
}

export async function criarProjeto(dados: DadosCriacaoProjeto) {
  return prisma.projeto.create({
    data: {
      empresaId: dados.empresaId,
      nome: dados.nome,
      nomeNormalizado: dados.nomeNormalizado,
      descricao: dados.descricao,
      status: dados.status,
      dataInicio: dados.dataInicio,
      dataLimite: dados.dataLimite
    },
    select: {
      id: true,
      nome: true,
      descricao: true,
      status: true,
      dataInicio: true,
      dataLimite: true,
      empresaId: true,
      criadoEm: true,
      atualizadoEm: true
    }
  });
}

export async function listarProjetosDaEmpresa(empresaId: string) {
  return prisma.projeto.findMany({
    where: {
      empresaId
    },
    select: {
      id: true,
      nome: true,
      descricao: true,
      status: true,
      dataInicio: true,
      dataLimite: true,
      criadoEm: true,
      atualizadoEm: true
    },
    orderBy: {
      criadoEm: "desc"
    }
  });
}

export async function buscarProjetoPorId(
  empresaId: string,
  projetoId: string
) {
  return prisma.projeto.findFirst({
    where: {
      id: projetoId,
      empresaId
    },
    select: {
      id: true,
      nome: true,
      descricao: true,
      status: true,
      dataInicio: true,
      dataLimite: true,
      empresaId: true,
      criadoEm: true,
      atualizadoEm: true,
      empresa: {
        select: {
          id: true,
          nome: true
        }
      }
    }
  });
}

export async function atualizarProjeto(dados: DadosAtualizacaoProjeto) {
  return prisma.projeto.update({
    where: {
      id: dados.projetoId
    },
    data: {
      nome: dados.nome,
      nomeNormalizado: dados.nomeNormalizado,
      descricao: dados.descricao,
      status: dados.status,
      dataInicio: dados.dataInicio,
      dataLimite: dados.dataLimite
    },
    select: {
      id: true,
      nome: true,
      descricao: true,
      status: true,
      dataInicio: true,
      dataLimite: true,
      empresaId: true,
      criadoEm: true,
      atualizadoEm: true
    }
  });
}

export async function excluirProjeto(projetoId: string) {
  return prisma.projeto.delete({
    where: {
      id: projetoId
    },
    select: {
      id: true,
      nome: true
    }
  });
}