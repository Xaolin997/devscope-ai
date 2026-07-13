import bcrypt from "bcrypt";
import {
  buscarUsuarioPorEmail,
  criarUsuario
} from "../repositories/usuario.repository.js";

type DadosCadastro = {
  nome: string;
  email: string;
  senha: string;
};

export async function cadastrarUsuario(dados: DadosCadastro) {
  const usuarioExistente = await buscarUsuarioPorEmail(dados.email);

  if (usuarioExistente) {
    throw new Error("EMAIL_JA_CADASTRADO");
  }

  const senhaHash = await bcrypt.hash(dados.senha, 10);

  return criarUsuario({
    nome: dados.nome,
    email: dados.email,
    senhaHash
  });
}