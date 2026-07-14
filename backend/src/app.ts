import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";

import { authRoutes } from "./modules/auth/auth.routes.js";
import { empresaRoutes } from "./modules/empresas/empresa.routes.js";

export function createApp() {
  const app = Fastify({
    logger: false
  });

  app.register(cors, {
    origin: true
  });

  app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute"
  });

  app.register(jwt, {
    secret: process.env.JWT_SECRET ?? "segredo-de-teste"
  });

  app.register(authRoutes, {
    prefix: "/auth"
  });

  app.register(empresaRoutes, {
    prefix: "/empresas"
  });

  app.get("/health", async () => {
    return {
      status: "ok",
      service: "DevScope API"
    };
  });

  return app;
}