import type { FastifyInstance } from "fastify";

import { verificarAutenticacao } from "../../middlewares/autenticacao.js";

import {
  atualizarEmpresaController,
  buscarEmpresaController,
  criarEmpresaController,
  excluirEmpresaController,
  listarEmpresasController,
} from "./empresa.controller.js";

const empresaParamsSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      format: "uuid",
      description: "ID da empresa",
    },
  },
  required: ["id"],
} as const;

const empresaBodySchema = {
  type: "object",
  properties: {
    nome: {
      type: "string",
      minLength: 1,
      examples: ["TechFlow"],
    },
  },
  required: ["nome"],
} as const;

export async function empresaRoutes(app: FastifyInstance) {
  app.addHook("preHandler", verificarAutenticacao);

  app.post(
    "/",
    {
      schema: {
        tags: ["Empresas"],
        summary: "Cria uma nova empresa",
        description:
          "Cria uma empresa e associa o usuário autenticado como administrador.",

        body: empresaBodySchema,

        response: {
          201: {
            type: "object",
            properties: {
              id: {
                type: "string",
                format: "uuid",
              },
              nome: {
                type: "string",
              },
              criadoEm: {
                type: "string",
              },
              atualizadoEm: {
                type: "string",
              },
            },
          },
        },
      },
    },
    criarEmpresaController,
  );

  app.get(
    "/",
    {
      schema: {
        tags: ["Empresas"],
        summary: "Lista as empresas do usuário autenticado",
        description:
          "Retorna todas as empresas das quais o usuário autenticado faz parte.",

        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  format: "uuid",
                },
                nome: {
                  type: "string",
                },
                criadoEm: {
                  type: "string",
                },
                atualizadoEm: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
    listarEmpresasController,
  );

  app.get(
    "/:id",
    {
      schema: {
        tags: ["Empresas"],
        summary: "Busca uma empresa pelo ID",
        description:
          "Retorna os dados de uma empresa da qual o usuário autenticado faz parte.",

        params: empresaParamsSchema,

        response: {
          200: {
            type: "object",
            properties: {
              id: {
                type: "string",
                format: "uuid",
              },
              nome: {
                type: "string",
              },
              criadoEm: {
                type: "string",
              },
              atualizadoEm: {
                type: "string",
              },
            },
          },
        },
      },
    },
    buscarEmpresaController,
  );

  app.patch(
    "/:id",
    {
      schema: {
        tags: ["Empresas"],
        summary: "Atualiza uma empresa",
        description:
          "Atualiza os dados de uma empresa administrada pelo usuário autenticado.",

        params: empresaParamsSchema,

        body: {
          type: "object",
          properties: {
            nome: {
              type: "string",
              minLength: 1,
              examples: ["TechFlow Atualizada"],
            },
          },
          minProperties: 1,
        },

        response: {
          200: {
            type: "object",
            properties: {
              id: {
                type: "string",
                format: "uuid",
              },
              nome: {
                type: "string",
              },
              criadoEm: {
                type: "string",
              },
              atualizadoEm: {
                type: "string",
              },
            },
          },
        },
      },
    },
    atualizarEmpresaController,
  );

  app.delete(
    "/:id",
    {
      schema: {
        tags: ["Empresas"],
        summary: "Exclui uma empresa",
        description:
          "Exclui uma empresa administrada pelo usuário autenticado.",

        params: empresaParamsSchema,

        response: {
          204: {
            type: "null",
          },
        },
      },
    },
    excluirEmpresaController,
  );
}
