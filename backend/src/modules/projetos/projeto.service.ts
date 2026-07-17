import { Prisma } from "../../generated/prisma/client.js";

import {
  DadosInvalidosError,
  RecursoDuplicadoError,
  RecursoNaoEncontradoError,
  SemPermissaoError,
} from "../../errors/domain-errors.js";

import {
  atualizarProjeto,
  buscarProjetoPorId,
  buscarVinculoEmpresa,
  criarProjeto,
  excluirProjeto,
  listarProjetosDaEmpresa,
} from "./projeto.repository.js";

type StatusProjeto = "ATIVO" | "PAUSADO" | "CONCLUIDO" | "CANCELADO";

type CadastrarProjetoInput = {
  usuarioId: string;
  empresaId: string;
  nome: string;
  descricao?: string;
  status?: StatusProjeto;
  dataInicio?: string;
  dataLimite?: string;
};

type EditarProjetoInput = {
  usuarioId: string;
  empresaId: string;
  projetoId: string;
  nome?: string;
  descricao?: string | null;
  status?: StatusProjeto;
  dataInicio?: string | null;
  dataLimite?: string | null;
};

function normalizarNome(nome: string) {
  return nome
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function converterDataCriacao(data: string | undefined): Date | undefined {
  if (data === undefined) {
    return undefined;
  }

  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) {
    throw new DadosInvalidosError("Data inválida");
  }

  return dataConvertida;
}

function converterDataAtualizacao(
  data: string | null | undefined,
): Date | null | undefined {
  if (data === undefined) {
    return undefined;
  }

  if (data === null) {
    return null;
  }

  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) {
    throw new DadosInvalidosError("Data inválida");
  }

  return dataConvertida;
}

function validarPeriodo(dataInicio?: Date | null, dataLimite?: Date | null) {
  if (dataInicio && dataLimite && dataLimite.getTime() < dataInicio.getTime()) {
    throw new DadosInvalidosError(
      "A data limite não pode ser anterior à data de início",
    );
  }
}

async function verificarMembro(empresaId: string, usuarioId: string) {
  const membro = await buscarVinculoEmpresa(empresaId, usuarioId);

  if (!membro) {
    throw new RecursoNaoEncontradoError("Empresa", "Empresa não encontrada");
  }

  return membro;
}

async function verificarPermissaoDeGerenciamento(
  empresaId: string,
  usuarioId: string,
) {
  const membro = await verificarMembro(empresaId, usuarioId);

  if (membro.cargo !== "ADMIN") {
    throw new SemPermissaoError();
  }

  return membro;
}

function tratarErroDeDuplicidade(erro: unknown): never {
  if (
    erro instanceof Prisma.PrismaClientKnownRequestError &&
    erro.code === "P2002"
  ) {
    throw new RecursoDuplicadoError(
      "Já existe um projeto com esse nome nesta empresa",
    );
  }

  throw erro;
}

export async function cadastrarProjeto(dados: CadastrarProjetoInput) {
  await verificarPermissaoDeGerenciamento(dados.empresaId, dados.usuarioId);

  const nome = dados.nome.trim();

  const dataInicio = converterDataCriacao(dados.dataInicio);

  const dataLimite = converterDataCriacao(dados.dataLimite);

  validarPeriodo(dataInicio, dataLimite);

  try {
    return await criarProjeto({
      empresaId: dados.empresaId,
      nome,
      nomeNormalizado: normalizarNome(nome),
      descricao: dados.descricao?.trim(),
      status: dados.status ?? "ATIVO",
      dataInicio,
      dataLimite,
    });
  } catch (erro) {
    tratarErroDeDuplicidade(erro);
  }
}

export async function buscarProjetos(empresaId: string, usuarioId: string) {
  await verificarMembro(empresaId, usuarioId);

  return listarProjetosDaEmpresa(empresaId);
}

export async function buscarProjeto(
  empresaId: string,
  projetoId: string,
  usuarioId: string,
) {
  await verificarMembro(empresaId, usuarioId);

  const projeto = await buscarProjetoPorId(empresaId, projetoId);

  if (!projeto) {
    throw new RecursoNaoEncontradoError("Projeto");
  }

  return projeto;
}

export async function editarProjeto(dados: EditarProjetoInput) {
  await verificarPermissaoDeGerenciamento(dados.empresaId, dados.usuarioId);

  const projetoExistente = await buscarProjetoPorId(
    dados.empresaId,
    dados.projetoId,
  );

  if (!projetoExistente) {
    throw new RecursoNaoEncontradoError("Projeto");
  }

  const nome = dados.nome !== undefined ? dados.nome.trim() : undefined;

  const novaDataInicio = converterDataAtualizacao(dados.dataInicio);

  const novaDataLimite = converterDataAtualizacao(dados.dataLimite);

  const dataInicioFinal =
    novaDataInicio === undefined ? projetoExistente.dataInicio : novaDataInicio;

  const dataLimiteFinal =
    novaDataLimite === undefined ? projetoExistente.dataLimite : novaDataLimite;

  validarPeriodo(dataInicioFinal, dataLimiteFinal);

  try {
    return await atualizarProjeto({
      projetoId: dados.projetoId,
      nome,
      nomeNormalizado: nome !== undefined ? normalizarNome(nome) : undefined,
      descricao:
        dados.descricao === undefined
          ? undefined
          : (dados.descricao?.trim() ?? null),
      status: dados.status,
      dataInicio: novaDataInicio,
      dataLimite: novaDataLimite,
    });
  } catch (erro) {
    tratarErroDeDuplicidade(erro);
  }
}

export async function removerProjeto(
  empresaId: string,
  projetoId: string,
  usuarioId: string,
) {
  await verificarPermissaoDeGerenciamento(empresaId, usuarioId);

  const projeto = await buscarProjetoPorId(empresaId, projetoId);

  if (!projeto) {
    throw new RecursoNaoEncontradoError("Projeto");
  }

  await excluirProjeto(projetoId);
}
