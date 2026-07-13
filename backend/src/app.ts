import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import { authRoutes } from "./routes/auth.routes.js";

export function createApp() {
  const app = Fastify({
    logger: true
  });

  app.register(cors, {
    origin: true
  });

  app.register(jwt, {
    secret: process.env.JWT_SECRET ?? "chave-temporaria"
  });

  app.register(authRoutes, {
    prefix: "/auth"
  });

  app.get("/health", async () => {
    return {
      status: "ok",
      service: "DevScope API"
    };
  });
  app.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute"
  });

  return app;
}