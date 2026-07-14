import {
  atualizarEmpresa,
  buscarEmpresaPorId,
  buscarMembroDaEmpresa,
  criarEmpresaComAdministrador,
  excluirEmpresa,
  listarEmpresasDoUsuario,
} from "./empresa.repository.js";

type DadosNovaEmpresa = {
  nome: string;
  usuarioId: string;
};

type DadosAtualizacaoEmpresa = {
  empresaId: string;
  usuarioId: string;
  nome: string;
};

function normalizarNome(nome: string) {
  return nome
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

async function verificarAdministrador(empresaId: string, usuarioId: string) {
  const membro = await buscarMembroDaEmpresa(empresaId, usuarioId);

  if (!membro) {
    throw new Error("EMPRESA_NAO_ENCONTRADA");
  }

  if (membro.cargo !== "ADMIN") {
    throw new Error("SEM_PERMISSAO");
  }
}

export async function criarEmpresa(dados: DadosNovaEmpresa) {
  const nome = dados.nome.trim();

  if (!nome) {
    throw new Error("NOME_EMPRESA_INVALIDO");
  }

  return criarEmpresaComAdministrador({
    nome,
    nomeNormalizado: normalizarNome(nome),
    usuarioId: dados.usuarioId,
  });
}

export async function buscarEmpresasDoUsuario(usuarioId: string) {
  return listarEmpresasDoUsuario(usuarioId);
}

export async function buscarEmpresaDoUsuario(
  empresaId: string,
  usuarioId: string,
) {
  const empresa = await buscarEmpresaPorId(empresaId, usuarioId);

  if (!empresa) {
    throw new Error("EMPRESA_NAO_ENCONTRADA");
  }

  return empresa;
}

export async function editarEmpresa(dados: DadosAtualizacaoEmpresa) {
  await verificarAdministrador(dados.empresaId, dados.usuarioId);

  const nome = dados.nome.trim();

  if (!nome) {
    throw new Error("NOME_EMPRESA_INVALIDO");
  }

  return atualizarEmpresa({
    empresaId: dados.empresaId,
    nome,
    nomeNormalizado: normalizarNome(nome),
  });
}

export async function removerEmpresa(empresaId: string, usuarioId: string) {
  await verificarAdministrador(empresaId, usuarioId);

  return excluirEmpresa(empresaId);
}
