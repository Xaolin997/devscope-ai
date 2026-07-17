import type { FastifyRequest } from "fastify";

import { TokenInvalidoError } from "../errors/domain-errors.js";

export async function verificarAutenticacao(request: FastifyRequest) {
  try {
    await request.jwtVerify();
  } catch {
    throw new TokenInvalidoError();
  }
}
