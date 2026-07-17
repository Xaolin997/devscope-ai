import type { FastifyInstance } from "fastify";

import { Prisma } from "../generated/prisma/client.js";
import { AppError } from "../errors/app-error.js";

export function configurarErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      const resposta: {
        erro: string;
        codigo: string;
        detalhes?: unknown;
      } = {
        erro: error.message,
        codigo: error.code,
      };

      if (error.details !== undefined) {
        resposta.detalhes = error.details;
      }

      return reply.status(error.statusCode).send(resposta);
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return reply.status(409).send({
        erro: "Já existe um registro com esses dados",
        codigo: "RECURSO_DUPLICADO",
      });
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return reply.status(404).send({
        erro: "Registro não encontrado",
        codigo: "RECURSO_NAO_ENCONTRADO",
      });
    }

    request.log.error(
      {
        erro: error,
        metodo: request.method,
        url: request.url,
      },
      "Erro não tratado",
    );

    return reply.status(500).send({
      erro: "Erro interno do servidor",
      codigo: "ERRO_INTERNO",
    });
  });
}
