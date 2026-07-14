import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { autenticarUsuario, cadastrarUsuario } from "./auth.service.js";

const cadastroSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export async function cadastroController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const validacao = cadastroSchema.safeParse(request.body);

  if (!validacao.success) {
    return reply.status(400).send({
      erro: "Dados inválidos",
      detalhes: validacao.error.flatten(),
    });
  }

  try {
    const usuario = await cadastrarUsuario(validacao.data);

    return reply.status(201).send(usuario);
  } catch (erro) {
    if (erro instanceof Error && erro.message === "EMAIL_JA_CADASTRADO") {
      return reply.status(409).send({
        erro: "Este e-mail já está cadastrado",
      });
    }

    request.log.error(erro);

    return reply.status(500).send({
      erro: "Erro interno do servidor",
    });
  }
}

export async function loginController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const validacao = loginSchema.safeParse(request.body);

  if (!validacao.success) {
    return reply.status(400).send({
      erro: "Dados inválidos",
      detalhes: validacao.error.flatten(),
    });
  }

  try {
    const usuario = await autenticarUsuario(validacao.data);

    const token = await reply.jwtSign(
      {
        sub: usuario.id,
        email: usuario.email,
      },
      {
        expiresIn: "7d",
      },
    );

    return reply.send({
      usuario,
      token,
    });
  } catch (erro) {
    if (erro instanceof Error && erro.message === "CREDENCIAIS_INVALIDAS") {
      return reply.status(401).send({
        erro: "E-mail ou senha inválidos",
      });
    }

    request.log.error(erro);

    return reply.status(500).send({
      erro: "Erro interno do servidor",
    });
  }
}
