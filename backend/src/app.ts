import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";

import { configurarSwagger } from "./config/swagger.js";
import { configurarErrorHandler } from "./plugins/error-handler.js";

import { authRoutes } from "./modules/auth/auth.routes.js";
import { empresaRoutes } from "./modules/empresas/empresa.routes.js";
import { projetoRoutes } from "./modules/projetos/projeto.routes.js";

export async function createApp() {
  const app = Fastify({
    logger: false,
  });

  await app.register(cors, {
    origin: true,
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  await app.register(jwt, {
    secret: process.env.JWT_SECRET ?? "segredo-de-teste",
  });

  await configurarSwagger(app);

  configurarErrorHandler(app);

  await app.register(authRoutes, {
    prefix: "/auth",
  });

  await app.register(empresaRoutes, {
    prefix: "/empresas",
  });

  await app.register(projetoRoutes, {
    prefix: "/empresas",
  });

  app.get(
    "/health",
    {
      schema: {
        tags: ["Health"],
        summary: "Verifica o estado da API",
        description: "Retorna uma confirmação de que a API está funcionando.",

        security: [],

        response: {
          200: {
            type: "object",
            properties: {
              status: {
                type: "string",
                examples: ["ok"],
              },
              service: {
                type: "string",
                examples: ["DevScope API"],
              },
            },
            required: ["status", "service"],
          },
        },
      },
    },
    async () => {
      return {
        status: "ok",
        service: "DevScope API",
      };
    },
  );

  return app;
}
