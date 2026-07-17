import type { FastifyReply, FastifyRequest } from "fastify";

import { DadosInvalidosError } from "../../errors/domain-errors.js";
import { autenticarUsuario, cadastrarUsuario } from "./auth.service.js";
import { cadastroSchema, loginSchema } from "./auth.schema.js";

export async function cadastroController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const validacao = cadastroSchema.safeParse(request.body);

  if (!validacao.success) {
    throw new DadosInvalidosError(
      "Dados inválidos",
      validacao.error.flatten(),
    );
  }

  const usuario = await cadastrarUsuario(validacao.data);

  return reply.status(201).send(usuario);
}

export async function loginController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const validacao = loginSchema.safeParse(request.body);

  if (!validacao.success) {
    throw new DadosInvalidosError(
      "Dados inválidos",
      validacao.error.flatten(),
    );
  }

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
}
