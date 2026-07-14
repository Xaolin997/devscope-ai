import {
  atualizarProjeto,
  buscarProjetoPorId,
  buscarVinculoEmpresa,
  criarProjeto,
  excluirProjeto,
  listarProjetosDaEmpresa
} from "./projeto.repository.js";

type StatusProjeto =
  | "ATIVO"
  | "PAUSADO"
  | "CONCLUIDO"
  | "CANCELADO";

type DadosNovoProjeto = {
  usuarioId: string;
  empresaId: string;
  nome: string;
  descricao?: string;
  status?: StatusProjeto;
  dataInicio?: string;
  dataLimite?: string;
};

type DadosEdicaoProjeto = {
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
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

async function verificarMembro(
  empresaId: string,
  usuarioId: string
) {
  const membro = await buscarVinculoEmpresa(empresaId, usuarioId);

  if (!membro) {
    throw new Error("EMPRESA_NAO_ENCONTRADA");
  }

  return membro;
}

async function verificarPermissaoDeGerenciamento(
  empresaId: string,
  usuarioId: string
) {
  const membro = await verificarMembro(empresaId, usuarioId);

  if (!["ADMIN", "GERENTE"].includes(membro.cargo)) {
    throw new Error("SEM_PERMISSAO");
  }

  return membro;
}

function converterData(data?: string | null) {
  if (data === null) {
    return null;
  }

  if (!data) {
    return undefined;
  }

  return new Date(data);
}

function validarPeriodo(
  dataInicio?: Date | null,
  dataLimite?: Date | null
) {
  if (
    dataInicio instanceof Date &&
    dataLimite instanceof Date &&
    dataLimite < dataInicio
  ) {
    throw new Error("PERIODO_INVALIDO");
  }
}

export async function cadastrarProjeto(dados: DadosNovoProjeto) {
  await verificarPermissaoDeGerenciamento(
    dados.empresaId,
    dados.usuarioId
  );

  const nome = dados.nome.trim();

  if (!nome) {
    throw new Error("NOME_PROJETO_INVALIDO");
  }

  const dataInicio = converterData(dados.dataInicio);
  const dataLimite = converterData(dados.dataLimite);

  validarPeriodo(dataInicio, dataLimite);

  return criarProjeto({
    empresaId: dados.empresaId,
    nome,
    nomeNormalizado: normalizarNome(nome),
    descricao: dados.descricao?.trim() || undefined,
    status: dados.status,
    dataInicio: dataInicio ?? undefined,
    dataLimite: dataLimite ?? undefined
  });
}

export async function buscarProjetos(
  empresaId: string,
  usuarioId: string
) {
  await verificarMembro(empresaId, usuarioId);

  return listarProjetosDaEmpresa(empresaId);
}

export async function buscarProjeto(
  empresaId: string,
  projetoId: string,
  usuarioId: string
) {
  await verificarMembro(empresaId, usuarioId);

  const projeto = await buscarProjetoPorId(empresaId, projetoId);

  if (!projeto) {
    throw new Error("PROJETO_NAO_ENCONTRADO");
  }

  return projeto;
}

export async function editarProjeto(dados: DadosEdicaoProjeto) {
  await verificarPermissaoDeGerenciamento(
    dados.empresaId,
    dados.usuarioId
  );

  const projetoExistente = await buscarProjetoPorId(
    dados.empresaId,
    dados.projetoId
  );

  if (!projetoExistente) {
    throw new Error("PROJETO_NAO_ENCONTRADO");
  }

  const nome =
    dados.nome !== undefined
      ? dados.nome.trim()
      : undefined;

  if (nome !== undefined && !nome) {
    throw new Error("NOME_PROJETO_INVALIDO");
  }

  const dataInicio =
    dados.dataInicio !== undefined
      ? converterData(dados.dataInicio)
      : undefined;

  const dataLimite =
    dados.dataLimite !== undefined
      ? converterData(dados.dataLimite)
      : undefined;

  const inicioFinal =
    dataInicio === undefined
      ? projetoExistente.dataInicio
      : dataInicio;

  const limiteFinal =
    dataLimite === undefined
      ? projetoExistente.dataLimite
      : dataLimite;

  validarPeriodo(inicioFinal, limiteFinal);

  return atualizarProjeto({
    projetoId: dados.projetoId,
    nome,
    nomeNormalizado: nome
      ? normalizarNome(nome)
      : undefined,
    descricao: dados.descricao,
    status: dados.status,
    dataInicio,
    dataLimite
  });
}

export async function removerProjeto(
  empresaId: string,
  projetoId: string,
  usuarioId: string
) {
  await verificarPermissaoDeGerenciamento(
    empresaId,
    usuarioId
  );

  const projeto = await buscarProjetoPorId(
    empresaId,
    projetoId
  );

  if (!projeto) {
    throw new Error("PROJETO_NAO_ENCONTRADO");
  }

  return excluirProjeto(projetoId);
}