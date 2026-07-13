import { FastifyInstance } from "fastify";
import { cadastroController } from "../src/controllers/auth.controller.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/cadastro", cadastroController);
}