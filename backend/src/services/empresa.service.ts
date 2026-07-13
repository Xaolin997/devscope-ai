import {
  criarEmpresaComAdministrador,
  listarEmpresasDoUsuario
} from "../repositories/empresa.repository.js";

type DadosNovaEmpresa = {
  nome: string;
  usuarioId: string;
};

export async function criarEmpresa(dados: DadosNovaEmpresa) {
  const nome = dados.nome.trim();

  if (!nome) {
    throw new Error("NOME_EMPRESA_INVALIDO");
  }

  return criarEmpresaComAdministrador(nome, dados.usuarioId);
}

export async function buscarEmpresasDoUsuario(usuarioId: string) {
  return listarEmpresasDoUsuario(usuarioId);
}