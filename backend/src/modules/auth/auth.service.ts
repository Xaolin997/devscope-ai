import bcrypt from "bcrypt";
import { buscarUsuarioPorEmail, criarUsuario } from "./usuario.repository.js";

type DadosCadastro = {
  nome: string;
  email: string;
  senha: string;
};

type DadosLogin = {
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
    senhaHash,
  });
}

export async function autenticarUsuario(dados: DadosLogin) {
  const usuario = await buscarUsuarioPorEmail(dados.email);

  if (!usuario) {
    throw new Error("CREDENCIAIS_INVALIDAS");
  }

  const senhaCorreta = await bcrypt.compare(dados.senha, usuario.senhaHash);

  if (!senhaCorreta) {
    throw new Error("CREDENCIAIS_INVALIDAS");
  }

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  };
}
