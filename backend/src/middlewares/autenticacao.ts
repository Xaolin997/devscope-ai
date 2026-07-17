import type { FastifyReply, FastifyRequest } from "fastify";

export async function verificarAutenticacao(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify();
  } catch {
    return reply.status(401).send({
      erro: "Token inválido ou não informado",
      codigo: "TOKEN_INVALIDO",
    });
  }
}
