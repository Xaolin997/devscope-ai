import type { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export async function configurarSwagger(app: FastifyInstance) {
  await app.register(swagger, {
    openapi: {
      info: {
        title: "DevScope AI API",
        description:
          "API REST para gerenciamento de empresas, projetos, sprints e tarefas.",
        version: "1.0.0",
      },

      servers: [
        {
          url: "http://localhost:3333",
          description: "Servidor de desenvolvimento",
        },
      ],

      tags: [
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

      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
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
