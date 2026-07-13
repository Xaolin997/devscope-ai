import {
  criarEmpresaComAdministrador,
  listarEmpresasDoUsuario
} from "../repositories/empresa.repository.js";

type DadosNovaEmpresa = {
  nome: string;
  usuarioId: string;
};

function normalizarNome(nome: string) {
  return nome
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export async function criarEmpresa(dados: DadosNovaEmpresa) {
  const nome = dados.nome.trim();

  if (!nome) {
    throw new Error("NOME_EMPRESA_INVALIDO");
  }

  const nomeNormalizado = normalizarNome(nome);

  return criarEmpresaComAdministrador({
    nome,
    nomeNormalizado,
    usuarioId: dados.usuarioId
  });
}

export async function buscarEmpresasDoUsuario(usuarioId: string) {
  return listarEmpresasDoUsuario(usuarioId);
}