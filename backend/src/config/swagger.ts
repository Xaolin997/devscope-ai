import type { FastifyInstance } from "fastify";

import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export async function configurarSwagger(app: FastifyInstance): Promise<void> {
  await app.register(swagger, {
    openapi: {
      openapi: "3.0.3",

      info: {
        title: "DevScope AI API",
        description: "Documentação da API do DevScope AI",
        version: "1.0.0",
      },

      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },

      security: [
        {
          bearerAuth: [],
        },
      ],

      tags: [
        {
          name: "Health",
          description: "Verificação do estado da API",
        },
        {
          name: "Autenticação",
          description: "Cadastro, login e perfil do usuário",
        },
        {
          name: "Empresas",
          description: "Gerenciamento de empresas",
        },
        {
          name: "Projetos",
          description: "Gerenciamento de projetos",
        },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",

    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
      persistAuthorization: true,
    },

    staticCSP: true,
  });
}
