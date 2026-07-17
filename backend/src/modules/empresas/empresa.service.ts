import { Prisma } from "../../generated/prisma/client.js";
import {
  RecursoDuplicadoError,
  RecursoNaoEncontradoError,
  SemPermissaoError,
} from "../../errors/domain-errors.js";
import { normalizarNome } from "../../helpers/normalizar-nome.js";
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

async function exigirAdministrador(
  empresaId: string,
  usuarioId: string,
) {
  const membro = await buscarMembroDaEmpresa(
    empresaId,
    usuarioId,
  );

  if (!membro) {
    throw new RecursoNaoEncontradoError(
      "Empresa",
      "Empresa não encontrada",
    );
  }

  if (membro.cargo !== "ADMIN") {
    throw new SemPermissaoError();
  }

  return membro;
}

function tratarDuplicidade(erro: unknown): never {
  if (
    erro instanceof Prisma.PrismaClientKnownRequestError &&
    erro.code === "P2002"
  ) {
    throw new RecursoDuplicadoError(
      "Você já possui uma empresa com esse nome",
    );
  }

  throw erro;
}

export async function criarEmpresa(dados: DadosNovaEmpresa) {
  const nome = dados.nome.trim();

  try {
    return await criarEmpresaComAdministrador({
      nome,
      nomeNormalizado: normalizarNome(nome),
      usuarioId: dados.usuarioId,
    });
  } catch (erro) {
    tratarDuplicidade(erro);
  }
}

export async function buscarEmpresasDoUsuario(usuarioId: string) {
  return listarEmpresasDoUsuario(usuarioId);
}

export async function buscarEmpresaDoUsuario(
  empresaId: string,
  usuarioId: string,
) {
  const empresa = await buscarEmpresaPorId(
    empresaId,
    usuarioId,
  );

  if (!empresa) {
    throw new RecursoNaoEncontradoError(
      "Empresa",
      "Empresa não encontrada",
    );
  }

  return empresa;
}

export async function editarEmpresa(dados: DadosAtualizacaoEmpresa) {
  await exigirAdministrador(dados.empresaId, dados.usuarioId);

  const nome = dados.nome.trim();

  try {
    return await atualizarEmpresa({
      empresaId: dados.empresaId,
      nome,
      nomeNormalizado: normalizarNome(nome),
    });
  } catch (erro) {
    tratarDuplicidade(erro);
  }
}

export async function removerEmpresa(
  empresaId: string,
  usuarioId: string,
) {
  await exigirAdministrador(empresaId, usuarioId);

  await excluirEmpresa(empresaId);
}
