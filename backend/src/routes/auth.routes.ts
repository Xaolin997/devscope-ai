import type { FastifyInstance } from "fastify";
import {
  cadastroController,
  loginController
} from "../controllers/auth.controller.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/cadastro", cadastroController);
  app.post("/login", loginController);
}