import type { FastifyInstance } from "fastify";

import { verificarAutenticacao } from "../../middlewares/autenticacao.js";

import {
  atualizarProjetoController,
  buscarProjetoController,
  criarProjetoController,
  excluirProjetoController,
  listarProjetosController,
} from "./projeto.controller.js";

const empresaParamsSchema = {
  type: "object",
  properties: {
    empresaId: {
      type: "string",
      format: "uuid",
    },
  },
  required: ["empresaId"],
};

const projetoParamsSchema = {
  type: "object",
  properties: {
    empresaId: {
      type: "string",
      format: "uuid",
    },
    projetoId: {
      type: "string",
      format: "uuid",
    },
  },
  required: ["empresaId", "projetoId"],
};

const securitySchema = [
  {
    bearerAuth: [],
  },
];

export async function projetoRoutes(app: FastifyInstance) {
  app.addHook("preHandler", verificarAutenticacao);

  app.post(
    "/:empresaId/projetos",
    {
      schema: {
        tags: ["Projetos"],
        summary: "Cria um projeto",
        security: securitySchema,
        params: empresaParamsSchema,
      },
    },
    criarProjetoController,
  );

  app.get(
    "/:empresaId/projetos",
    {
      schema: {
        tags: ["Projetos"],
        summary: "Lista os projetos de uma empresa",

        params: {
          type: "object",
          properties: {
            empresaId: {
              type: "string",
              format: "uuid",
            },
          },
          required: ["empresaId"],
        },
      },
    },
    listarProjetosController,
  );

  app.get(
    "/:empresaId/projetos/:projetoId",
    {
      schema: {
        tags: ["Projetos"],
        summary: "Busca um projeto pelo ID",
        security: securitySchema,
        params: projetoParamsSchema,
      },
    },
    buscarProjetoController,
  );

  app.patch(
    "/:empresaId/projetos/:projetoId",
    {
      schema: {
        tags: ["Projetos"],
        summary: "Atualiza um projeto",
        security: securitySchema,
        params: projetoParamsSchema,
      },
    },
    atualizarProjetoController,
  );

  app.delete(
    "/:empresaId/projetos/:projetoId",
    {
      schema: {
        tags: ["Projetos"],
        summary: "Exclui um projeto",
        security: securitySchema,
        params: projetoParamsSchema,
      },
    },
    excluirProjetoController,
  );
}
