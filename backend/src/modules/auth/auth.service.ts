import bcrypt from "bcrypt";

import { Prisma } from "../../generated/prisma/client.js";
import {
  CredenciaisInvalidasError,
  RecursoDuplicadoError,
} from "../../errors/domain-errors.js";
import type { DadosCadastro, DadosLogin } from "./auth.schema.js";
import {
  buscarUsuarioPorEmail,
  criarUsuario,
} from "./usuario.repository.js";

export async function cadastrarUsuario(dados: DadosCadastro) {
  const nome = dados.nome.trim();
  const email = dados.email.trim().toLowerCase();

  const usuarioExistente = await buscarUsuarioPorEmail(email);

  if (usuarioExistente) {
    throw new RecursoDuplicadoError(
      "Este e-mail já está cadastrado",
    );
  }

  const senhaHash = await bcrypt.hash(dados.senha, 10);

  try {
    return await criarUsuario({
      nome,
      email,
      senhaHash,
    });
  } catch (erro) {
    if (
      erro instanceof Prisma.PrismaClientKnownRequestError &&
      erro.code === "P2002"
    ) {
      throw new RecursoDuplicadoError(
        "Este e-mail já está cadastrado",
      );
    }

    throw erro;
  }
}

export async function autenticarUsuario(dados: DadosLogin) {
  const email = dados.email.trim().toLowerCase();
  const usuario = await buscarUsuarioPorEmail(email);

  if (!usuario) {
    throw new CredenciaisInvalidasError();
  }

  const senhaCorreta = await bcrypt.compare(
    dados.senha,
    usuario.senhaHash,
  );

  if (!senhaCorreta) {
    throw new CredenciaisInvalidasError();
  }

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  };
}
