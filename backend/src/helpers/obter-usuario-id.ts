import type { FastifyRequest } from "fastify";

export function obterUsuarioId(request: FastifyRequest) {
  return request.user.sub;
}
