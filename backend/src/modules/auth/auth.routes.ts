import type { FastifyInstance } from "fastify";

import { obterUsuarioId } from "../../helpers/obter-usuario-id.js";
import { verificarAutenticacao } from "../../middlewares/autenticacao.js";
import { cadastroController, loginController } from "./auth.controller.js";

export async function authRoutes(app: FastifyInstance) {
  app.post(
    "/cadastro",
    {
      schema: {
        tags: ["Autenticação"],
        summary: "Cadastra um novo usuário",
        description: "Cria uma nova conta de usuário.",
        security: [],

        body: {
          type: "object",
          properties: {
            nome: {
              type: "string",
              examples: ["João Silva"],
            },
            email: {
              type: "string",
              format: "email",
              examples: ["joao@email.com"],
            },
            senha: {
              type: "string",
              minLength: 6,
              examples: ["123456"],
            },
          },
          required: ["nome", "email", "senha"],
        },
      },
    },
    cadastroController,
  );

  app.post(
    "/login",
    {
      schema: {
        tags: ["Autenticação"],
        summary: "Autentica um usuário",
        description: "Valida as credenciais e retorna um token JWT.",
        security: [],

        body: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              examples: ["joao@email.com"],
            },
            senha: {
              type: "string",
              examples: ["123456"],
            },
          },
          required: ["email", "senha"],
        },
      },
    },
    loginController,
  );

  app.get(
    "/perfil",
    {
      preHandler: verificarAutenticacao,

      schema: {
        tags: ["Autenticação"],
        summary: "Retorna o perfil do usuário autenticado",

        response: {
          200: {
            type: "object",
            properties: {
              usuarioId: {
                type: "string",
                format: "uuid",
              },
              email: {
                type: "string",
                format: "email",
              },
            },
            required: ["usuarioId", "email"],
          },
        },
      },
    },
    async (request) => {
      return {
        usuarioId: obterUsuarioId(request),
        email: request.user.email,
      };
    },
  );
}
